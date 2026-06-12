'use client'

import { AppWindow, Download } from 'lucide-react'
import { motion } from 'motion/react'
import NoUpload from './icons/no-upload'
import NoAccount from './icons/no-account'
import { buttonVariants } from './ui/button'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut' as const
    }
  }
}

const Features = () => {
  return (
    <motion.div
      className="*:cursor-default! flex items-center justify-center gap-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.span
        variants={itemVariants}
        className={buttonVariants({ variant: 'outline', size: 'default', className: 'p-6' })}
      >
        <AppWindow className="size-4" />
        In-browser
      </motion.span>
      <motion.span
        variants={itemVariants}
        className={buttonVariants({ variant: 'outline', size: 'default', className: 'p-6' })}
      >
        <NoUpload className="size-4" />
        No upload needed
      </motion.span>
      <motion.span
        variants={itemVariants}
        className={buttonVariants({ variant: 'outline', size: 'default', className: 'p-6' })}
      >
        <Download className="size-4" />
        Instant save
      </motion.span>
      <motion.span
        variants={itemVariants}
        className={buttonVariants({ variant: 'outline', size: 'default', className: 'p-6' })}
      >
        <NoAccount className="size-4" />
        No account needed
      </motion.span>
    </motion.div>
  )
}

export default Features
