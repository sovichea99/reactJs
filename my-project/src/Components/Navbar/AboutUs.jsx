import React from 'react'
import Footer from '../Home/Footer'
import { motion } from 'framer-motion'
import Aboutusimg from '../../assets/2751001.jpg'
import { FadeLeft, FadeRight } from '../../ultility/animation'
import mission from '../../assets/mission.png'

const AboutUs = () => {
  return (
    <> 
      <div className="flex flex-col items-center max-w-screen-xl mx-auto px-4 py-8">
        <div className="sm:flex items-center w-full mb-8">
          <motion.div
            variants={FadeRight(0.6)}
            initial="hidden"
            animate="visible"
            className="sm:w-1/2 flex justify-center p-6"
          >
            <img src={Aboutusimg} className="lg:w-[500px] w-full max-w-md" alt="About Us" />
          </motion.div>
          <div className="sm:w-1/2 p-5 flex justify-center sm:justify-start text-center sm:text-left">
            <motion.div
              variants={FadeLeft(0.5)}
              initial="hidden"
              animate="visible"
              className="max-w-lg"
            >
              <h2 className="my-4 font-bold text-3xl sm:text-4xl">
                <span className="text-green-600">About</span> <span className="text-secondary">Our Company</span>
              </h2>
              <motion.p
                variants={FadeLeft(0.6)}
                initial="hidden"
                animate="visible"
                className="text-gray-700"
              >
                Welcome to FURNITURE STORE! Founded in 2024, we began with a simple goal: to create beautiful, high-quality furniture that combines elegance with functionality. Our journey started with a small team of designers passionate about craftsmanship and a shared belief in the power of thoughtfully designed spaces. Since then, we’ve grown into a full-service furniture brand, bringing style and comfort into homes, offices, and spaces across the country.
              </motion.p>
            </motion.div>
          </div>
        </div>

        <div className="sm:flex items-center w-full mb-8">
          <div className="sm:w-1/2 p-5 flex justify-center sm:justify-start text-center sm:text-left">
            <motion.div
              variants={FadeRight(0.5)}
              initial="hidden"
              animate="visible"
              className="max-w-lg"
            >
              <h2 className="my-4 font-bold text-3xl sm:text-4xl">
                <span className="text-green-600">Our</span> <span className="text-secondary">Mission</span>
              </h2>
              <motion.p
                variants={FadeRight(0.6)}
                initial="hidden"
                animate="visible"
                className="text-gray-700"
              >
                At FURNITURE STORE, we believe that furniture should do more than just fill a room—it should elevate it. Our mission is to make stylish, durable, and accessible furniture that helps you create spaces you’ll love. Whether you're refreshing a single room or redesigning an entire home, we’re here to inspire and empower you to bring your vision to life.
              </motion.p>
            </motion.div>
          </div>
          <motion.div
            variants={FadeLeft(0.6)}
            initial="hidden"
            animate="visible"
            className="sm:w-1/2 flex justify-center p-6"
          >
            <img src={mission} className="lg:w-[500px] w-full max-w-md" alt="Mission" />
          </motion.div>
        </div>
      </div>
      <div>
      <Footer />
      </div>
    </>
  )
}

export default AboutUs;
