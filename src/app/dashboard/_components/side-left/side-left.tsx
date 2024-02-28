"use client"


import { cn } from '@/lib/utils';
import { useDragControls, motion } from 'framer-motion';
import React, { useState } from 'react'
import Workspaces from './workspaces';

export default function SideLeft() {
    const [isDragging, setIsDragging] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const controls = useDragControls();

    return (
        <motion.section className={cn('w-60 flex h-full flex-row-reverse bg-pri shadow-md border-r-2 border-sec',
            isDragging && "cursor-grabbing"
        )}
            onMouseLeave={() => { setIsDragging(false); setIsHovering(false); }}
            initial={{ x: -118 }}
            drag="x"
            dragConstraints={{ left: -225.5, right: -40 }}
            dragElastic={0.02}

        >
            <div className={cn('flex h-full w-3 bg-sec flex-row gap-1 items-center justify-center transition-opacity duration-300 border-l-2 border-sec',
                !isHovering && "opacity-0 cursor-default",
                isHovering && "cursor-grab",
                isDragging && "cursor-grabbing",
            )}
                onMouseEnter={() => setIsHovering(true)}
                onMouseDown={() => { setIsDragging(true) }}
                onMouseUp={() => { setIsDragging(false); }}
                onPointerDown={(e) => { controls.start(e) }}
            >
                <span className='h-1/2 w-1 rounded-md bg-tert'></span>
            </div>
            <div className='flex h-full w-full justify-end py-4'>
                <Workspaces />
            </div>
        </ motion.section >

    )

}




