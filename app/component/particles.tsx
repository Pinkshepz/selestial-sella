"use client";

import React, { useState, useEffect } from "react";

export default function Particles (): React.ReactNode {

    // 1. data structure of eachobject's style
    interface ObjectStyle {
        pos_x: string,
        pos_y: string,
        velocity_x: number,
        velocity_y: number,
        height: string,
        width: string,
        backgroundColor: string,
        opacity: number
    }

    // 2. set state of this page
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 }); // cursor position
    const [screenWidth, setScreenWidth] = useState(0); // screen size: width
    const [screenHeight, setScreenHeight] = useState(0); // screen size: height
    const [objectStyle, setObjectStyle] = useState<ObjectStyle[]>([]); // all objects' style

    // 3. track cursor position. Update when cursor position is changed
    const setCoordinate = (e: MouseEvent) => {
        setCursorPos({ x: e.clientX, y: e.clientY });
    };
    
    useEffect(() => {
        window.addEventListener("mousemove", setCoordinate);
    }, [setCoordinate]);

    // 4. track screen size. Update when cursor position is changed
    const setScreenSize = () => {
        setScreenWidth(window.innerWidth);
        setScreenHeight(window.innerHeight);
    };

    useEffect(() => {
        window.addEventListener("mousemove", setScreenSize);
    }, [setScreenSize]);

    // 5. object_spacing of objects -> lesser means more density -> more objects displayed
    const object_spacing = 30;

    // 6. set initial object coordinates
    useEffect(() => {
        // array storing object style
        let temp_objects_style: ObjectStyle[] = [];

        // loop for each row
        for (let row = 0; row < (window.innerHeight / object_spacing); row++) {
        // loop for each column
            for (let column = 0; column < (window.innerWidth / object_spacing); column++) {
                const common_rand: number = Math.random();

                const rare_bubble_chance = 5;

                // select color
                let color: string
                if ((((row + 1) * 9 + (column + 1)) % rare_bubble_chance) == 0) {
                    color = "#"+(common_rand * 0xFFFFFF << 0).toString(16).padStart(6, '0')
                } else {
                    color = "#acbccf"
                }

                // select bubble size
                let size: string
                if ((((row + 1) * 9 + (column + 1)) % rare_bubble_chance) == 0) {
                    size = 1 + (common_rand * 24) + "px"
                } else {
                    size = 1 + (common_rand * 12) + "px"
                }

                // config initial style
                const style = {
                    pos_x: (column * object_spacing) + "px",
                    pos_y: (row * object_spacing) + "px",
                    velocity_x: (Math.random() - 0.5) * 25,
                    velocity_y: (Math.random() - 0.5) * 25,
                    height: size,
                    width: size,
                    backgroundColor: color,
                    opacity: (1.0 - Math.random()) * 0.5
                }

                // record style
                temp_objects_style.push(style);
            }
        }

        // save objects
        setObjectStyle(temp_objects_style)
    }, [])

    // 7. run clock
    const [time, setTime] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 50);
        return () => {
            clearInterval(interval);
        };
    }, [time]);

    // 8. animate objects
    // control particle moving in only screen space only
    const spaceControl = (pos: number, screenSize: number) => {
        if (pos <= 0) {
            return screenSize
        } else {
            return pos % screenSize
        };
    }

    useEffect(() => {
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
                
                const max_acceleration = 2;
                const limit_distance = 156;

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
                temp_objects_style.push({
                    pos_x: spaceControl(objectPosX + objectStyle[index].velocity_x, screenWidth).toString() + "px",
                    pos_y: spaceControl(objectPosY + objectStyle[index].velocity_y, screenHeight).toString() + "px",
                    velocity_x: ((objectStyle[index].velocity_x) + acceleration(dx, distance_xy)) * 0.9 + (Math.random() - 0.5),
                    velocity_y: ((objectStyle[index].velocity_y) + acceleration(dy, distance_xy)) * 0.9 + (Math.random() - 0.5),
                    height: objectStyle[index].height,
                    width: objectStyle[index].width,
                    backgroundColor: objectStyle[index].backgroundColor,
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
    }, [time])

    return (
        <div className="relative h-full w-full overflow-hidden">
            <div className="absolute w-[100%] pos_y-0 flex flex-col justify-center">
                {Object.values(objectStyle).map((style, index) => (
                    <div
                    className="absolute rounded-full"
                    style={{
                        left: style.pos_x,
                        top: style.pos_y,
                        height: style.height,
                        width: style.width,
                        backgroundColor: style.backgroundColor,
                        opacity: style.opacity
                    }}
                    key={index}></div>
                ))}
            </div>
        </div>
    );
};
