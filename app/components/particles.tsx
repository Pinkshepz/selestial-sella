"use client";

//// 1.1 Metadata & module & framework
import React, { useState, useEffect } from "react";

//// 1.2 Custom React hooks
import useEventListener from "../utility/hooks/useEventListener";

//// 1.3 React components
////     N/A

//// 1.4 Utility functions
import stringToHex from "../utility/function/color/string-to-rgb";

//// 1.5 Public and others
////     N/A


export default function Particles (): React.ReactNode {

    // Set keyboard interaction
    const [freeze, setFreeze] = useState(1);
    const [glitter, setGlitter] = useState(false);
    const [monochrome, setMonochrome] = useState(false);
    const monoColor = "#acbcbf";

    function handler({ key }: {key: string}): void {
        if (["1"].includes(String(key))) {
            setFreeze((prev) => prev == 0 ? 1 : 0);
            return;
        }
        if (["2"].includes(String(key))) {
            setGlitter((prev) => !prev);
            return;
        }
        if (["3"].includes(String(key))) {
            setMonochrome((prev) => !prev);
            return;
        }
    }
    
    useEventListener('keydown', handler);

    // 1. data structure of eachobject's style
    interface ObjectStyle {
        pos_x: string,
        pos_y: string,
        velocity_x: number,
        velocity_y: number,
        height: string,
        width: string,
        backgroundColor: string,
        boxShadow: string,
        opacity: number
    }

    // 2. set state of this page
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 }); // cursor position
    const [objectStyle, setObjectStyle] = useState<ObjectStyle[]>([]); // all objects' style
    const [power, setPower] = useState(0); // power for particle accerelation


    // 3A. track cursor position. Update when cursor position is changed
    const setCoordinate = (e: MouseEvent) => {
        setCursorPos({ x: e.clientX, y: e.clientY });
    };

    useEffect(() => {
        window.addEventListener("mousemove", setCoordinate);
        return () => window.removeEventListener("mousemove", setCoordinate);
    }, [setCoordinate]);
    

    // 3B. handle onclick -> create accerelation.
    const powerLimit = 16;

    const boostPower = () => {
        if (power < powerLimit) {
            setPower((prev) => (prev + 1) * 1.1);
        }
        else {
            setPower(powerLimit);
        }
    };

    const dragPower = () => {
        if (power > 0) {
            setPower((prev) => prev - (0.2 / (60 / fps)));
        }
        else {
            setPower(0);
        }
    };
    
    useEffect(() => {
        window.addEventListener("mousedown", boostPower);
        return () => window.removeEventListener("mousedown", boostPower);
    }, [boostPower]);


    // 4. object_spacing of objects -> lesser means more density -> more objects displayed
    const object_spacing = 75;
    const rare_bubble_chance = 2; // density of colorful bubbles
    
    
    // 5. run clock
    const fps = 12;
    const [time, setTime] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 60 / fps);
        return () => {
            clearInterval(interval);
        };
    }, [time * freeze]);


    // 6. set initial object coordinates
    useEffect(() => {
        // array storing object style
        let temp_objects_style: ObjectStyle[] = [];
        
        // loop for each row
        for (let row = 0; row < (window.innerHeight / object_spacing); row++) {
            // loop for each column
            for (let column = 0; column < (window.innerWidth / object_spacing); column++) {
                const common_rand: number = Math.random();

                // select color
                let color: string
                if ((((row + 1) * 9 + (column + 1)) % rare_bubble_chance) == 0) {
                    color = stringToHex(String(common_rand), "dark");
                } else {
                    color = monoColor;
                }

                // select bubble size
                let size: number
                if ((((row + 1) * 9 + (column + 1)) % rare_bubble_chance) == 0) {
                    size = 1 + (common_rand * 48)
                } else {
                    size = 1 + (common_rand * 12)
                }

                // config initial style
                const style = {
                    pos_x: (column * object_spacing) + "px",
                    pos_y: (row * object_spacing) + "px",
                    velocity_x: (Math.random() - 0.5) * 25,
                    velocity_y: (Math.random() - 0.5) * 25,
                    height: size + "px",
                    width: size + "px",
                    backgroundColor: color,
                    boxShadow: `0px 0px ${size * 0.75}px #ffffff99, 0px 0px ${size * 1.5}px ${color}`,
                    opacity: 1
                }

                // record style
                temp_objects_style.push(style);
            }
        }

        // save objects
        setObjectStyle(temp_objects_style);
    }, [])

    // 7. animate objects
    // control particle moving in only screen space only
    const spaceControl = (pos: number, screenSize: number) => {
        if (pos <= 0) {
            return screenSize
        } else {
            return pos % screenSize
        };
    }

    useEffect(() => {
        // reduce power
        dragPower()

        // update objects state
        if (objectStyle.length > 100) {
            let temp_objects_style: ObjectStyle[] = [];
            for (let index = 0; index < objectStyle.length; index++) {
                // calculate position and movement direction of object
                const objectPosX = Number(objectStyle[index].pos_x.split("px")[0]);
                const objectPosY = Number(objectStyle[index].pos_y.split("px")[0]);
                const dx = (objectPosX - cursorPos.x);
                const dy = (objectPosY - cursorPos.y);
                let distance_xy = ((dx ** 2) + (dy ** 2)) ** 0.5;
                
                const max_acceleration = 12 * (power + 1);
                const limit_distance = window.innerWidth / 12;
                
                const acceleration = (dPos: number, distance_xy: number) => {
                    if (distance_xy > limit_distance) return 0; // if distance is too far -> null
                    // if distance is in 100px radius -> closer to cursor, more acceleration is
                    if (dPos >= 0) {
                        return (-1 * dPos * (max_acceleration / limit_distance) + max_acceleration) * (-1 * distance_xy * (1 / limit_distance) + 1)
                    } else {
                        return (-1 * dPos * (max_acceleration / limit_distance) + max_acceleration) * (-1 * distance_xy * (1 / limit_distance) + 1) * -1
                    }
                }

                // updated style
                // velocity_t = (constant + (power * radial vector) + radial force from cursor + noise) * friction
                const newColor = stringToHex(String(Math.random()), "dark");
                temp_objects_style.push({
                    pos_x: spaceControl(objectPosX + objectStyle[index].velocity_x, window.innerWidth).toString() + "px",
                    pos_y: spaceControl(objectPosY + objectStyle[index].velocity_y, window.innerHeight).toString() + "px",
                    velocity_x: 0.05 + ((power / 10) * (cursorPos.x - (window.innerWidth / 2)) / window.innerWidth) + ((objectStyle[index].velocity_x) + acceleration(dx, distance_xy)) * 0.97 + (Math.random() - 0.5) / 2,
                    velocity_y: 0.0 + ((power / 10) * (cursorPos.y - (window.innerHeight / 2)) / window.innerHeight) + ((objectStyle[index].velocity_y) + acceleration(dy, distance_xy)) * 0.97 + (Math.random() - 0.5) / 2,
                    height: objectStyle[index].height,
                    width: objectStyle[index].width,
                    backgroundColor: glitter ? newColor : monochrome ? "#00000000" : objectStyle[index].backgroundColor,
                    boxShadow: glitter ? `0px 0px ${Number(objectStyle[index].height.split("px")[0]) * 0.75}px #ffffff99, 0px 0px ${Number(objectStyle[index].height.split("px")[0]) * 1.5}px ${newColor}` : objectStyle[index].boxShadow,
                    opacity: objectStyle[index].opacity
                });
            } // end for loop of each object
            
            // update new object parameters when all bubbles parameters are ready
            try {
                if (temp_objects_style[objectStyle.length - 1].pos_x.split("px")[0] != "NaN") {
                    setObjectStyle(temp_objects_style);
                }
            } catch (error) {}
        }
    }, [time * freeze])

    return (
        <div className="relative h-full w-full overflow-hidden">
            <div className="absolute h-full w-full pos_y-0 flex flex-col justify-center">
                {Object.values(objectStyle).map((style, index) => (
                    <div
                    className="absolute rounded-full"
                    style={{
                        left: style.pos_x,
                        top: style.pos_y,
                        height: style.height,
                        width: style.width,
                        backgroundColor: style.backgroundColor,
                        boxShadow: style.boxShadow,
                        opacity: style.opacity
                    }}
                    key={index}></div>
                ))}
            </div>
            <div className="absolute pixellet right-10 bottom-10 font-bold select-none cursor-default">{Math.round(power)}</div>
        </div>
    );
};
