"use client";

import { BackgroundRippleEffect } from "./background-ripple-effect";

export function BackgroundRippleEffectDemo() {
    return (
        <div
            className="relative flex min-h-screen w-full flex-col items-start justify-start overflow-hidden bg-neutral-950">
            <BackgroundRippleEffect />
            <div className="mt-60 w-full">
                <h2
                    className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-neutral-100 md:text-4xl lg:text-7xl">
                    Interactive Background Boxes Ripple Effect
                </h2>
                <p
                    className="relative z-10 mx-auto mt-4 max-w-xl text-center text-neutral-400">
                    Hover over the boxes above and click. To be used on backgrounds of hero
                    sections OR Call to Action sections. I beg you don&apos;t use it
                    everywhere.
                </p>
            </div>
        </div>
    );
}
