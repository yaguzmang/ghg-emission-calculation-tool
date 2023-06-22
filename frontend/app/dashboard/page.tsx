'use client';

import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  return (
    <main className="relative mx-4 mt-10 md:mx-12">
      <div>
        <div>
          <span>XXXX</span>
          <span className="px-2 text-secondary">/</span>
          <span className="text-secondary">GHG calculator</span>
        </div>
        <h1 className="mt-3 text-3xl">GHG CALCULATOR</h1>
        <div className="mt-6">
          <Tabs defaultValue="xxxx" className="relative mr-auto w-full">
            <div className="flex items-center justify-between">
              <TabsList className="w-full justify-start rounded-none bg-transparent p-0">
                <TabsTrigger
                  value="xxxx"
                  className="relative justify-start rounded-none border-b-[3px] border-b-transparent bg-transparent px-4 py-0 text-2xl font-semibold text-primary shadow-none data-[state=active]:border-b-secondary data-[state=active]:text-secondary md:min-w-[180px] md:px-0"
                >
                  <span className="pb-2 uppercase md:pl-2">XXXX</span>
                </TabsTrigger>
                <TabsTrigger
                  value="form"
                  className="relative justify-start rounded-none border-b-[3px] border-b-transparent bg-transparent px-4 py-0 text-2xl font-semibold text-primary shadow-none data-[state=active]:border-b-secondary data-[state=active]:text-secondary md:min-w-[180px] md:px-0"
                >
                  <span className="pb-2 uppercase md:pl-2">Form</span>
                </TabsTrigger>
                <TabsTrigger
                  value="results"
                  className="relative justify-start rounded-none border-b-[3px] border-b-transparent bg-transparent px-4 py-0 text-2xl font-semibold text-primary shadow-none data-[state=active]:border-b-secondary data-[state=active]:text-secondary md:min-w-[180px] md:px-0"
                >
                  <span className="pb-2 uppercase md:pl-2">Results</span>
                </TabsTrigger>
              </TabsList>
            </div>
            <div
              className={cn(
                'flex min-h-[350px] justify-center p-10 shadow-strong'
              )}
            >
              <TabsContent value="xxxx">
                <div className="flex flex-col space-y-4">XXXX</div>
              </TabsContent>
              <TabsContent value="form">
                <div className="flex flex-col space-y-4">Form</div>
              </TabsContent>
              <TabsContent value="results">
                <div className="flex flex-col space-y-4">Results</div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
