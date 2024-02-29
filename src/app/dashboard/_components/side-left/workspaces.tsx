"use client"

import React, { useState, useEffect, useRef } from 'react'
import { DropdownMenuTrigger, DropdownMenu, DropdownMenuSeparator, DropdownMenuContent, DropdownMenuRadioItem, DropdownMenuRadioGroup } from '@/components/ui/dropdown-menu';
import { ChevronsUpDown, Layers, PlusSquare } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { Button } from '@/components/ui/button';


export default function Workspaces() {
    // TODO: fetch current + all workspaces from rust
    const [currentWorkspace, setCurrentWorkspace] = useState("");
    const [workspaces, setWorkspaces] = useState([""]);
    const [showInputBox, setShowInputBox] = useState(false);
    const inputElementRef = useRef<HTMLInputElement>(null);

    interface Workspace {
        title: string;
        id: number;
        createdAt: string;
        updatedAt: string;
    }

    // track input focus
    useEffect(() => {
        inputElementRef.current?.focus();
        inputElementRef.current?.addEventListener('focusout', () => {
            setShowInputBox(false);
        });
        return () => {
            inputElementRef.current?.removeEventListener('focusout', () => {
                setShowInputBox(false);
            });
        }

    }, [showInputBox === true]);

    useEffect(() => {
        invoke('get_workspaces',).then((res: any) => {
            let json_result = JSON.parse(res) as Workspace[];
            //console.log(json_result);
            const name_buffer: string[] = [];
            for (const row in json_result) {
                console.log(json_result[row].title);
                name_buffer.push(json_result[row].title);
            }
            if (name_buffer.length > 0) {
                setWorkspaces(name_buffer);
                setCurrentWorkspace(name_buffer[0]);
            }

        })
    }, [])

    return (
        <div className='flex w-[10.8rem] items-start justify-center px-2'>
            <DropdownMenu>
                <div className='mr-2.5 flex flex-col gap-1'>
                    <div className='flex flex-row gap-1'>
                        <DropdownMenuTrigger className='outline-none'>
                            <div className='duration-400 font-mediumoutline-1 flex flex-row items-center justify-center rounded-sm p-0.5 px-1 outline outline-1 outline-input'>
                                <Layers size={16} />
                                <span className='pl-1'>Workspaces</span>
                                <ChevronsUpDown size={17} />
                            </div>
                        </DropdownMenuTrigger>
                        <Button variant="outline" className='h-full p-1'
                            onClick={() => {
                                setShowInputBox(true);
                            }}
                        >
                            <PlusSquare size={20} />
                        </Button>
                    </div>
                    {showInputBox && <input ref={inputElementRef} type="text" className='h-8 w-full rounded-sm px-1 font-medium shadow-sm outline-1 outline-input focus:outline' placeholder='...My Workspace #1'
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && inputElementRef.current?.value !== '') {
                                //console.log('submit');
                                e.preventDefault();
                                invoke('create_workspace', { workspaceTitle: inputElementRef.current?.value })
                                setWorkspaces([...workspaces, inputElementRef.current?.value as string]);
                                setShowInputBox(false);
                            }
                        }}
                    />}
                </div>
                <DropdownMenuContent>
                    <DropdownMenuRadioGroup value={currentWorkspace} onValueChange={setCurrentWorkspace}>
                        {workspaces.map((space, index) => (
                            space && <div key={`main-${space}-${index}`}>
                                <DropdownMenuSeparator key={`top-${index}-${space}`} />
                                <DropdownMenuRadioItem key={`${space}-${index}`} value={space} className='cursor-pointer font-medium'>
                                    {space}
                                </DropdownMenuRadioItem>
                            </div>
                        ))}
                        <DropdownMenuSeparator key={`end`} />
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>

        </div>
    )
}
