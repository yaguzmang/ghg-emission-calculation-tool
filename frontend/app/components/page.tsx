import React from 'react';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons/icons';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function UIComponents() {
  return (
    <main>
      <div className="grid place-items-center">
        <div className="grid  w-[400px] grid-cols-2 place-items-stretch content-center gap-4  bg-white p-4">
          <div className="col-span-full text-center">
            <h1 className="text-3xl font-black uppercase text-secondary">
              UI Elements
            </h1>
          </div>
          <div className="col-span-full text-center">
            <h2>Buttons</h2>
          </div>
          <Button>Primary</Button>

          <Button disabled>Disabled</Button>

          <Button variant="secondary">Secondary</Button>
          <Button variant="secondary" disabled>
            Disabled
          </Button>

          <Button variant="light">Light</Button>
          <Button variant="light" disabled>
            Disabled
          </Button>

          <Button variant="outline">Outlined</Button>
          <Button variant="outline" disabled>
            Disabled
          </Button>

          <Button>
            <Icons.Search className="mr-2 h-4 w-4" />
            With icon left
          </Button>
          <Button disabled>
            <Icons.Search className="mr-2 h-4 w-4" />
            Disabled
          </Button>

          <Button variant="secondary">
            With icon right
            <Icons.Close className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="secondary" disabled>
            Disabled
            <Icons.Check className="ml-2 h-4 w-4" />
          </Button>

          <div className="text-center">
            <Button variant="link" size="fit">
              Link
            </Button>
          </div>
          <div className="text-center">
            <Button variant="link" size="fit" disabled>
              Disabled
            </Button>
          </div>

          <div className="text-center">
            <Button variant="icon" size="fit">
              <Icons.QuestionMark />
            </Button>
          </div>
          <div className="text-center">
            <Button variant="icon" size="fit" disabled>
              <Icons.QuestionMark />
            </Button>
          </div>
          <div className="col-span-full text-center">
            <h2>Inputs</h2>
          </div>
          <Input placeholder="Regular input..." />
          <Input placeholder="Error state input..." error />
          <Input placeholder="Disabled input..." disabled />
          <div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Organization Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Organization Units</SelectLabel>
                  <SelectItem value="Gym">Gym</SelectItem>
                  <SelectItem value="engineering-building" disabled>
                    Engineering building
                  </SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectItem value="admin-building">Admin building</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="Organization Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Organization Units</SelectLabel>
                  <SelectItem value="Gym">Gym</SelectItem>
                  <SelectItem value="engineering-building" disabled>
                    Engineering building
                  </SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectItem value="admin-building">Admin building</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-full text-center">
            <h2>Headings</h2>
          </div>
          <div className="col-span-full text-center">
            <h1 className=" place-items-center justify-center">H1</h1>
            <h2>H2</h2>
            <h3>H3</h3>
            <h4>H4</h4>
            <h5>H5</h5>
          </div>

          <div className="col-span-full text-center">
            <h2>Shadows</h2>
          </div>

          <div className="col-span-full h-60 w-full bg-background">
            <h3 className="p-4">Base</h3>
          </div>
          <div className="col-span-full my-4 h-60 w-full shadow-light">
            <h3 className="p-4">Light</h3>
          </div>
          <div className="col-span-full my-4 h-60 w-full shadow-soft">
            <h3 className="p-4">Soft</h3>
          </div>
          <div className="col-span-full my-4 h-60 w-full shadow-strong">
            <h3 className="p-4">Strong</h3>
          </div>
        </div>
      </div>
    </main>
  );
}
