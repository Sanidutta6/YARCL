import React from 'react'
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

const Installation = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="mb-6">Installation</h1>
            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Prerequisites</h2>
                    <p className="text-muted-foreground mb-4">
                        React Tailwind UI requires the following dependencies to be installed in your project:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>React 18 or higher</li>
                        <li>Tailwind CSS 3.0 or higher</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Setup</h2>
                    <p className="text-muted-foreground mb-4">
                        Follow these steps to set up your project with React Tailwind UI:
                    </p>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium">1. Install React</h3>
                            <div className="code-block mt-2">
                                <pre className="overflow-x-auto">
                                    <code className="text-sm">
                                        npm create vite@latest my-app -- --template react-ts
                                    </code>
                                </pre>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium">2. Install Tailwind CSS</h3>
                            <div className="code-block mt-2">
                                <pre className="overflow-x-auto">
                                    <code className="text-sm">
                                        npm install -D tailwindcss postcss autoprefixer
                                        npx tailwindcss init -p
                                    </code>
                                </pre>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium">3. Configure Tailwind CSS</h3>
                            <p className="text-muted-foreground mb-2">
                                Add the paths to all of your template files in your tailwind.config.js file:
                            </p>
                            <div className="code-block mt-2">
                                <pre className="overflow-x-auto">
                                    <code className="text-sm">
                                        {`// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`}
                                    </code>
                                </pre>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium">4. Add Tailwind directives to your CSS</h3>
                            <p className="text-muted-foreground mb-2">
                                Add the Tailwind directives to your CSS file:
                            </p>
                            <div className="code-block mt-2">
                                <pre className="overflow-x-auto">
                                    <code className="text-sm">
                                        {`/* index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;`}
                                    </code>
                                </pre>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium">5. Copy components</h3>
                            <p className="text-muted-foreground">
                                Copy the components you need directly from React Tailwind UI into your project.
                                Each component is self-contained and can be used immediately.
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Adding Icons</h2>
                    <p className="text-muted-foreground mb-2">
                        React Tailwind UI uses Lucide React for icons. To use the same icons, you'll need to install Lucide:
                    </p>
                    <div className="code-block mt-2">
                        <pre className="overflow-x-auto">
                            <code className="text-sm">
                                npm install lucide-react
                            </code>
                        </pre>
                    </div>
                </section>

                <div className="mt-8 text-center">
                    <Link
                        to="/components"
                        className="inline-flex items-center justify-center px-4 py-2 font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        Browse Components
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Installation