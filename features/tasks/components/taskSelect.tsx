"use client";

import type { RefObject } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Select } from "@base-ui/react/select";

type TaskSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  portalContainer?: RefObject<HTMLElement | null>;
  hideLabel?: boolean;
  className?: string;
  triggerClassName?: string;
};

export function TaskSelect({ label, value, onChange, options, portalContainer, hideLabel = false, className, triggerClassName }: TaskSelectProps) {
  return (
    <div className={className}>
    <Select.Root<string>
      value={value}
      onValueChange={(nextValue) => {
        if (nextValue !== null) onChange(nextValue);
      }}
      items={options}
    >
      <Select.Label className={hideLabel ? "sr-only" : "mb-1.5 block text-sm font-medium text-[#425047] dark:text-[#d3ddd5]"}>
        {label}
      </Select.Label>
      <Select.Trigger
        className={`inline-flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-[#dfe5de] bg-[#fcfcfa] px-3.5 text-left text-sm text-[#314037] outline-none transition hover:border-[#bdcbbd] focus-visible:ring-2 focus-visible:ring-[#719378]/40 data-[popup-open]:border-[#719378] dark:border-[#34443a] dark:bg-[#151e18] dark:text-[#e8eee9] dark:hover:border-[#526b57] dark:data-[popup-open]:border-[#719378] ${triggerClassName ?? ""}`}
      >
        <Select.Value />
        <Select.Icon className="text-[#819087] dark:text-[#a3b0a7]">
          <ChevronDown className="size-4" aria-hidden="true" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal container={portalContainer}>
        <Select.Positioner side="bottom" align="start" sideOffset={6} collisionPadding={12} className="z-[100] outline-none">
          <Select.Popup className="planify-popup w-[var(--anchor-width)] max-w-[calc(100vw-2rem)] max-h-[min(18rem,var(--available-height))] overflow-x-hidden overflow-y-auto rounded-xl border border-[#dfe5de] bg-white p-1.5 shadow-xl shadow-[#153521]/15 outline-none dark:border-[#3a4b3e] dark:bg-[#1b271f] dark:shadow-black/30">
            <Select.List>
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="flex min-h-10 cursor-default items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-[#46544a] outline-none transition data-[highlighted]:bg-[#f0f5ef] data-[highlighted]:text-[#17452d] data-[selected]:bg-[#e8f0e7] data-[selected]:font-semibold data-[selected]:text-[#17452d] dark:text-[#c9d4cb] dark:data-[highlighted]:bg-[#26382b] dark:data-[highlighted]:text-[#e5eee7] dark:data-[selected]:bg-[#2b3d2f] dark:data-[selected]:text-[#d6ead9]"
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator className="text-[#28613c] dark:text-[#a7d1af]">
                    <Check className="size-4" aria-hidden="true" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
    </div>
  );
}
