import { ArrowRight, Github, Package } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router'

const Home = () => {
    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-4 py-8">
                <h1 className="text-5xl font-bold tracking-tight">
                    React Tailwind UI
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                    A comprehensive component library built with React and Tailwind CSS, designed to be copied and pasted into your projects.
                </p>

                <div className="flex flex-wrap gap-4 mt-6 justify-center">
                    <Link
                        to="/components"
                        className="inline-flex items-center justify-center h-10 px-4 py-2 font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                    >
                        Browse Components
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <a
                        href="https://github.com/Sanidutta6/YARCL"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center h-10 px-4 py-2 font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                    >
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                <div className="border rounded-lg p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Package className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">No Dependencies</h2>
                    <p className="text-muted-foreground">
                        Built with only React and Tailwind CSS. No third-party component libraries or dependencies.
                    </p>
                </div>

                <div className="border rounded-lg p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <svg
                            className="h-5 w-5 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Styled with Tailwind</h2>
                    <p className="text-muted-foreground">
                        Fully styled with Tailwind CSS, making it easy to customize to match your design system.
                    </p>
                </div>

                <div className="border rounded-lg p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <svg
                            className="h-5 w-5 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Copy & Paste</h2>
                    <p className="text-muted-foreground">
                        Each component is designed to be copied and pasted into your project, giving you complete control.
                    </p>
                </div>

                <div className="border rounded-lg p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <svg
                            className="h-5 w-5 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20.618 5.984A11.955 11.955 0 0112 2.5c-2.968 0-5.71 1.08-7.823 2.874A11.944 11.944 0 001.498 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-2.336-.65-4.53-1.78-6.406"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Accessibility</h2>
                    <p className="text-muted-foreground">
                        All components are built with accessibility in mind, following WAI-ARIA guidelines.
                    </p>
                </div>
            </div>

            <div className="mt-16 text-center">
                <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
                <div className="code-block mb-6 text-left">
                    <pre className="overflow-x-auto">
                        <code className="text-sm">
                            npm install react tailwindcss
                        </code>
                    </pre>
                </div>
                <Link
                    to="/installation"
                    className="inline-flex items-center text-primary hover:underline"
                >
                    Read the installation guide
                    <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
            </div>
        </div>
    )
}

export default Home