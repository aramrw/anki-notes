// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use sqlx::{migrate::MigrateDatabase, Sqlite, SqlitePool};
#[allow(warnings, unused)]
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
use tauri::{command, Manager};

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let appdata_dir = app.path().app_data_dir().unwrap();
            if !appdata_dir.exists() {
                std::fs::create_dir(&appdata_dir).unwrap();
            }
            println!("{}", &appdata_dir.to_string_lossy());
            create_database(appdata_dir.join("main").to_str().unwrap());
            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![get_workspaces])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn create_database(path: &str) {
    tokio::task::block_in_place(move || {
        tauri::async_runtime::block_on(async move {
            if !Sqlite::database_exists(&path).await.unwrap_or(false) {
                Sqlite::create_database(&path).await?;
            }

            let _db = SqlitePool::connect(&path).await?;
            Ok::<(), sqlx::Error>(())
        })
    })
    .unwrap();
}

#[command]
async fn get_workspaces() {}
