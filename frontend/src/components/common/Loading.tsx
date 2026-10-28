import React from 'react'
import clsx from 'clsx'

interface LoadingProps {
  fullHeight?: boolean
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

const Loading: React.FC<LoadingProps> = ({ fullHeight, message, size = 'md' }) => {
  const spinnerSize = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center gap-4',
        fullHeight && 'min-h-screen'
      )}
    >
      <div
        className={clsx(
          'animate-spin rounded-full border-4 border-gray-200 border-t-primary-600',
          spinnerSize[size]
        )}
      />
      {message && <p className="text-center text-gray-600">{message}</p>}
    </div>
  )
}

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: string
  width?: string
}

const Skeleton: React.FC<SkeletonProps> = ({ height = 'h-4', width = 'w-full', className, ...props }) => (
  <div
    className={clsx('animate-pulse rounded-lg bg-gray-200', height, width, className)}
    {...props}
  />
)

export { Loading, Skeleton }
