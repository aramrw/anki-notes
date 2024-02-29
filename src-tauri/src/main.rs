// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::future::IntoFuture;

use serde_json::{to_string, to_string_pretty};
use tauri::generate_handler;
use tokio::sync::Mutex;

use serde::{Deserialize, Serialize, Serializer};
use sqlx::{migrate::MigrateDatabase, Row, Sqlite, SqlitePool};
#[allow(warnings, unused)]
use tauri::{command, AppHandle, Manager};
use uuid::Uuid;

#[derive(Deserialize)]
struct WorkspaceError {
    message: String,
}

impl Serialize for WorkspaceError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(&self.message)
    }
}

#[derive(Serialize, Deserialize)]
struct Workspace {
    id: String,
    title: String,
    created_at: String,
    updated_at: String,
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle();
            let appdata_dir = app.path().app_data_dir().unwrap();
            if !appdata_dir.exists() {
                std::fs::create_dir(&appdata_dir).unwrap();
            }
            // println!("{}", &appdata_dir.to_string_lossy());
            create_database(
                appdata_dir
                    .join("main.db")
                    .to_str()
                    .expect("FATAL: Could not create database!"),
                handle.clone(),
            );
            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(generate_handler![create_workspace, get_workspaces])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// ** DB Functions/Commands **
#[command]
async fn create_workspace(workspace_title: &str, handle: AppHandle) -> Result<(), WorkspaceError> {
    let pool_mutex = handle.state::<Mutex<SqlitePool>>().clone();
    let pool = pool_mutex.lock().into_future().await;

    let uuid = Uuid::new_v4().to_string();
    //let now = chrono::Utc::now();

    sqlx::query("INSERT INTO workspace (id, title, createdAt, updatedAt) VALUES (?, ?, datetime('now'), datetime('now'))")
        .bind(uuid)
        .bind(workspace_title)
        .execute(&*pool)
        .await
        .unwrap();
    Ok(())
}

#[command]
async fn get_workspaces(handle: AppHandle) -> Result<String, WorkspaceError> {
    let pool_mutex = handle.state::<Mutex<SqlitePool>>().clone();
    let pool = pool_mutex.lock().into_future().await;

    let result = sqlx::query("SELECT * FROM workspace")
        .fetch_all(&*pool)
        .await
        .unwrap();

    let mut workspaces: Vec<Workspace> = Vec::new();
    result.iter().for_each(|row| {
        workspaces.push(Workspace {
            id: row.get(0),
            title: row.get(1),
            created_at: row.get(2),
            updated_at: row.get(3),
        });
    });

    let json_result = to_string_pretty(&workspaces).unwrap();

    Ok(json_result)
}

// ! IMPORTANT: DO NOT REMOVE/EDIT THESE FUNCTIONS
fn create_database(path: &str, handle: AppHandle) {
    tokio::task::block_in_place(move || {
        tauri::async_runtime::block_on(async move {
            if !Sqlite::database_exists(&path).await.unwrap_or(false) {
                Sqlite::create_database(&path).await?;
            }

            let sqlite_pool = SqlitePool::connect(&path).await?;
            let pool = sqlite_pool.clone();
            handle.manage(Mutex::new(sqlite_pool));

            sqlx::migrate!("./prisma/migrations").run(&pool).await?;

            Ok::<(), sqlx::Error>(())
        })
    })
    .unwrap();
}
