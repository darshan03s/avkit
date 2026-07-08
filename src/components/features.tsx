'use client'

import { AppWindow, Download } from 'lucide-react'
import { motion } from 'motion/react'
import { NoUpload } from './icons/no-upload'
import { NoAccount } from './icons/no-account'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut' as const
    }
  }
}

export const Features = () => {
  const features = [
    {
      icon: AppWindow,
      title: 'In-browser'
    },
    {
      icon: NoUpload,
      title: 'No upload needed'
    },
    {
      icon: Download,
      title: 'Instant save'
    },
    {
      icon: NoAccount,
      title: 'No account needed'
    }
  ] as const

  return (
    <motion.div
      className="*:cursor-default! flex items-center justify-center gap-4 flex-wrap"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {features.map((feature) => (
        <motion.span
          key={feature.title}
          variants={itemVariants}
          className="p-3 md:p-4 text-sm md:text-base outline-border outline-1 rounded-lg flex items-center gap-2 bg-foreground/5 hover:bg-foreground/8 transition-colors"
        >
          <feature.icon className="size-4" />
          {feature.title}
        </motion.span>
      ))}
    </motion.div>
  )
}
