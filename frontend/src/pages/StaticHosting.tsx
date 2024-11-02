import React from 'react'

function StaticHosting() {
    return (
        <div className=''>
            <div className='p-20'>
                <div className='text-2xl font-semibold'>Deploy a static site</div>
                <div className='flex flex-col gap-10 pt-14 w-full'>
                    <div className='grid grid-cols-3 w-full'>
                        <div className='text-xl col-span-1 font-semibold'>Source Code</div>
                        <div className='col-span-2 flex flex-col gap-2'>
                            <div className='border-md border-solid border p-2'>
                                <input type="text" placeholder='GitHub Repository' className='w-full outline-none'/>
                            </div>
                            <button className='bg-black text-xl text-white p-2 flex flex-row ml-auto'>Connect</button>
                        </div>
                    </div>
                    <form className='flex flex-col gap-10' action="">
                        <div className='flex flex-row justify-center items-center grid grid-cols-3'>
                            <div className='col-span-1'>
                                <div className='text-xl font-semibold'>Name</div>
                                <p className='text-zinc-500'>A unique name for the static site</p>
                            </div>
                            <div className='border-md col-span-2 border-solid border'>
                                <input type="text" placeholder='site name' className='w-full p-2'/>
                            </div>
                        </div>
                        <div className='grid grid-cols-3 flex flex-row items-center'>
                            <div className='col-span-1'>
                                <div className='text-xl font-semibold'>Branch</div>
                                <p className='text-zinc-500'>Which Git branch to build and deploy</p>
                            </div>
                            <div className='border-md col-span-2 border-solid border'>
                                <input type="text" placeholder='branch' className='w-full p-2'/>
                            </div>
                        </div>
                        <div className='grid grid-cols-3  flex flex-row items-center'>
                            <div className='col-span-1'>
                                <div className='flex flex-row gap-5 items-center'>
                                    <div className='text-xl font-semibold'>Root Directory</div>
                                    <div className='text-md text-zinc-400'>Optional</div>
                                </div>
                                <p className='text-zinc-500'>Commands will run from this directory rather than the repository root </p>
                            </div>
                            <div className='border-md col-span-2 border-solid border'>
                                <input type="text" placeholder='e.g. src' className='w-full p-2'/>
                            </div>
                        </div>
                        <div className='grid grid-cols-3 flex flex-row items-center'>
                            <div className='col-span-1'>
                                <div className='text-xl font-semibold'>Build Command</div>
                                {/* <p className='text-zinc-500'></p> */}
                            </div>
                            <div className='border-md col-span-2 border-solid border'>
                                <input type="text" placeholder='e.g. npm install' className='w-full p-2'/>
                            </div>
                        </div>
                        <div className='grid grid-cols-3 flex flex-row items-center'>
                            <div className='col-span-1'>
                                <div className='text-xl font-semibold'>Publish directory</div>
                                <p className='text-zinc-500'>The relative path of the directory containing built assets to publish. Examples: ./, ./build, dist and frontend/build.</p>
                            </div>
                            <div className='border-md col-span-2 border-solid border'>
                                <input type="text" placeholder='' className='w-full p-2'/>
                            </div>
                        </div>
                        <div className='flex flex-col gap-5 border p-6'>
                            <div className='flex flex-col'>
                                <div className='text-2xl font-semibold'>Environment variables</div>
                                <p className='text-zinc-500'>Set environment-specific config and secrets (such as API keys), then read those values from your code.</p>
                            </div>
                            <div className='flex flex-col gap-5'>
                                <div className='flex flex-row gap-4'>
                                    <div className='border basis-1/2'>
                                        <input type="text" placeholder='NAME_OF_VARIABLE' className='w-full h-full p-2'/>
                                    </div>
                                    <div className='border basis-1/2'>
                                        <input type="text" placeholder='value' className='w-full h-full p-2'/>
                                    </div>
                                    <button className='bg-red-500 text-white p-3 font-semibold' onClick={e=>e.preventDefault()}>Delete</button>
                                </div>
                            </div>
                            <div>
                                <button className='border p-3 hover:bg-black hover:text-white' onClick={e=>e.preventDefault()}>+ Add Environment Variable</button>
                            </div>
                        </div>
                        <input type="submit" value={"Deploy"} className='cursor-pointer bg-black text-white text-2xl mr-auto p-2'/>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default StaticHosting
