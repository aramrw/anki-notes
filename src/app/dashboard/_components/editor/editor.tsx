"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Note } from '../../dashboard'
import { Bold, Italic, Strikethrough, Underline } from 'lucide-react';
import { stdout } from 'process';

export default function Editor({ currentNote }: { currentNote: Note }) {

    const [lines, setLines] = useState<string[]>([]);
    const mainContainerDivRef = useRef<HTMLDivElement>(null);

    const parseText = (event: React.FormEvent<HTMLDivElement>) => {
        //setLines(event.currentTarget.textContent?.split('\n') || []);
    }

    useEffect(() => {
        console.log(lines)
    }, [lines]);

    return (
        <div className='fixed z-0 h-full w-full bg-accent p-4 pl-9'
            ref={mainContainerDivRef}
        >
            <div className='h-fit w-full rounded-sm bg-sec p-2 drop-shadow-sm'>
                <h1 className='text-3xl font-bold'>{currentNote.title}</h1>
            </div>
            <menu className='mt-4 flex h-8 w-full flex-row items-center justify-start gap-0.5 rounded-t-sm bg-tert p-1 drop-shadow-md'>
                <li className='cursor-pointer rounded-sm p-0.5 hover:bg-quat'>
                    <Bold size={17} strokeWidth={3.1} />
                </li>
                <li className='cursor-pointer rounded-sm p-0.5 hover:bg-quat'>
                    <Italic size={17} strokeWidth={3.1} />
                </li>
                <li className='cursor-pointer rounded-sm p-0.5 hover:bg-quat'>
                    <Strikethrough size={17} strokeWidth={3.1} />
                </li>
                <li className='cursor-pointer rounded-sm p-0.5 hover:bg-quat'>
                    <Underline size={17} strokeWidth={3.1} />
                </li>
            </menu>
            <div className='h-full w-full bg-background drop-shadow-lg' >
                {lines.length > 0 && (
                    <div contentEditable id="text-editor" className='h-fit w-full bg-red-500 px-4 focus:outline-1 focus:outline-accent' onInput={(event) => parseText(event)} onKeyDown={(event) => {
                        if (event.key === "Enter" && event.currentTarget.textContent !== null) {
                            setLines((prev) => [event.currentTarget.textContent || '', ...prev])
                        }
                    }}>
                        {lines[0]}
                    </div>
                )}
                {lines.length > 0 ? lines.map((line, index) => (
                    <div contentEditable id="text-editor" className='h-fit w-full bg-blue-500 px-4 focus:outline-1 focus:outline-accent' onInput={(event) => parseText(event)} key={index} onKeyDown={(event) => {
                        if (event.key === "Enter" && event.currentTarget.textContent) {
                            setLines([event.currentTarget.textContent])
                        }
                    }} />
                )) : (
                    <div contentEditable id="text-editor" className='h-fit w-full bg-green-500 px-4 focus:outline-1 focus:outline-accent' onInput={(event) => parseText(event)} onKeyDown={(event) => {
                        if (event.key === "Enter" && event.currentTarget.textContent) {
                            setLines([event.currentTarget.textContent])
                        }
                    }} />
                )}
            </div>
        </div>
    )
}
