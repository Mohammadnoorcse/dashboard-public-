<template>
    <ClientOnly>
        <template  #fallback>
            <div class="text-center animate-pulse mt-[20%] w-64 flex-col m-auto items-center flex">
                <img class="h-16 w-auto" src="/logo.png" alt="Loading..." />
                <p>Loading...</p>
            </div>
        </template>
        <NuxtPage />
    </ClientOnly>
</template>