'use client'

import {
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon
} from '@heroicons/react/24/outline'
import React from 'react'

const navigation = [


  { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
  { name: 'Team', href: '#', icon: UsersIcon, current: false },
  { name: 'Projects', href: '#', icon: FolderIcon, current: false },
  { name: 'Calendar', href: '#', icon: CalendarIcon, current: false },
  { name: 'Documents', href: '#', icon: DocumentDuplicateIcon, current: false },
  { name: 'Reports', href: '#', icon: ChartPieIcon, current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function ActivityBar() {

  return (
    <div className={classNames("hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50",
      "lg:block lg:w-20 lg:overflow-y-auto lg:bg-gray-900 lg:pb-4")}>
      <div className="flex h-16 shrink-0 items-center justify-center">
        <img
          alt="Your Company"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
          className="h-8 w-auto"
        />
      </div>
      <nav className="mt-8">
        <ul role="list" className="flex flex-col items-center space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={classNames(
                  item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                  'group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6',
                )}
              >
                <item.icon aria-hidden="true" className="h-6 w-6 shrink-0" />
                <span className="sr-only">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}