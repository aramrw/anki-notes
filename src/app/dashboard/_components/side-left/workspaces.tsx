"use client"

import React, { useState, useEffect } from 'react'
import { DropdownMenuTrigger, DropdownMenu, DropdownMenuSeparator, DropdownMenuContent, DropdownMenuRadioItem, DropdownMenuRadioGroup } from '@/components/ui/dropdown-menu';
import { ChevronsUpDown, Layers, NotebookPen } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';


export default function Workspaces() {
    let [workspace, setWorkspace] = useState("JP");
    let [workspaces, setWorkspaces] = useState(["JP", "US", "UK", "AU", "CA", "NZ"]);

    useEffect(() => {
        // Fetch workspaces from db
        invoke("get_workspaces").then((spaces) => {
            setWorkspaces(spaces as string[])
        })
    }, []);

    return (
        <div className='flex w-[10.8rem] items-start justify-center px-2'>
            <DropdownMenu>
                <DropdownMenuTrigger className='outline-none'>
                    <div className='duration-400 flex flex-row items-center justify-center rounded-sm p-0.5 px-1 font-medium shadow-sm'>
                        <Layers size={16} />
                        <span className='pl-0.5'>Workspaces</span>
                        <ChevronsUpDown size={17} />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuRadioGroup value={workspace} onValueChange={setWorkspace}>
                        {workspaces.map((space, index) => (
                            <>
                                <DropdownMenuSeparator key={`top-${index}-${space}`} />
                                <DropdownMenuRadioItem key={`${space}-${index}`} value={space} className='cursor-pointer'>
                                    {space}
                                </DropdownMenuRadioItem>
                            </>
                        ))}
                        <DropdownMenuSeparator key={`end`} />
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>

        </div>
    )
}
