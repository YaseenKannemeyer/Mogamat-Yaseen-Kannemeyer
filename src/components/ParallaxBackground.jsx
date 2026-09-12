import { motion, useScroll, useSpring, useTransform } from "motion/react";

const ParallaxBackground = () => {
    const { scrollYProgress } = useScroll();
    const x = useSpring(scrollYProgress, {damping:50});
    const mountain3Y = useTransform(x, [0, 0.5], ["0%", "70%"]);
    const planetsX = useTransform(x, [0, 0.5], ["0%", "-20%"]);
    const mountain2Y = useTransform(x, [0, 0.5], ["0%", "30%"]);
    const mountain1Y = useTransform(x, [0, 0.5], ["0%", "0%"]);
    return (
        <div className='absolute inset-0 bg-black/40' aria-hidden="true">
            <div className='relative h-screen overflow-y-hidden'>
                {/* Background Sky */}
                <div className="parallax-layer parallax-sky absolute inset-0 w-full h-screen -z-50" />
                {/* Mountain Layer 3 */}
                <motion.div
                    className="parallax-layer parallax-mountain-3 absolute inset-0 -z-40"
                    style={{ y: mountain3Y }}
                />
                {/* Planets */}
                <motion.div
                    className="parallax-layer parallax-planets absolute inset-0 -z-30"
                    style={{ x: planetsX }}
                />
                {/* Mountain Layer 2 */}
                <motion.div
                    className="parallax-layer parallax-mountain-2 absolute inset-0 -z-20"
                    style={{ y: mountain2Y }}
                />
                {/* Mountain Layer 1 */}
                <motion.div
                    className="parallax-layer parallax-mountain-1 absolute inset-0 -z-10"
                    style={{ y: mountain1Y }}
                />

            </div>
        </div>
    )
}

export default ParallaxBackground