<template>
    <div class="w-full bg-gray-100">
        <NuxtLoadingIndicator />
        <div class="w-full fixed print:hidden"><Header/></div>
        <div class="w-full flex">
            <div class="w-1/6 bg-white mt-[3rem] shadow-[0_0px_4px_1px_rgba(0,0,0,0.3)] print:hidden">
                <Sidebar/>
            </div>
            <div class="w-5/6 mt-14 print:w-full print:mt-0">
                <div class="min-h-[calc(100vh-5.23rem)] print:h-full">
                    <slot />
                </div>
                
                <div class="w-full print:hidden"><Footer/></div>
            </div>
            
        </div>
    </div>
</template>