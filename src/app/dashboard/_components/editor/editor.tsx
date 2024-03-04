"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Note } from '../../dashboard'
import { Bold, Italic, Strikethrough, Underline } from 'lucide-react';
import { stdout } from 'process';
import { clearInterval } from 'timers';

export default function Editor({ currentNote }: { currentNote: Note }) {

    const [lines, setLines] = useState<string[]>([""]);
    const mainContainerDivRef = useRef<HTMLDivElement>(null);
    const divRefs = lines.map(() => React.createRef<HTMLDivElement>());

    const parseText = (event: React.FormEvent<HTMLDivElement>) => {
        //setLines(event.currentTarget.textContent?.split('\n') || []);
    }

    useEffect(() => {
        if (divRefs[0] && divRefs.length === 1) {
            divRefs[0].current?.focus();
        } else {
            while (divRefs.length < lines.length) {
                divRefs.push(React.createRef<HTMLDivElement>());
            }
        }

    }, [lines]);

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
                {lines.map((line, index) => (
                    <div contentEditable id="text-editor" className='h-fit w-full px-4 outline-none' key={index} ref={divRefs[index]} onInput={(event) => {
                        event.preventDefault();
                        if (event?.currentTarget.textContent) {
                            let array = [...lines]
                            array.splice(index + 1, 1, event?.currentTarget.textContent)
                            setLines(array)
                        }
                    }} onKeyDown={(event) => {
                        let array = [...lines];
                        if (event.key === "Enter" && event.currentTarget.textContent) {
                            event.preventDefault();
                            array.push(event.currentTarget.textContent)
                            setLines(array)
                            if (divRefs[index + 1]) {
                                divRefs[index + 1].current?.focus();
                            }
                        } else if (event.key === "Backspace" && event.currentTarget.textContent === undefined || event.key === "Backspace" && event.currentTarget.textContent?.length == 0) {
                            if (index !== 0) {
                                event.preventDefault();
                                array.splice(index, 1);
                                setLines(array)
                                if (divRefs[index - 1]) {
                                    divRefs[index - 1].current?.focus();
                                }
                            }
                        }
                    }} />
                ))}
            </div>
        </div>
    )
}
