"use client";
import { atom, useAtom } from "jotai";

export const aiDrawerStateAtom = atom<boolean>(false);
export const manualDrawerStateAtom = atom<boolean>(false);
export const listDrawerStateAtom = atom<boolean>(false);

// Create a custom hook for each specific drawer
export function useAIDrawerState() {
  const [isOpen, setIsOpen] = useAtom(aiDrawerStateAtom);
  const toggleDrawer = () => setIsOpen((open) => !open);
  return { isOpen, toggleDrawer, setIsOpen };
}

export function useManualDrawerState() {
  const [isOpen, setIsOpen] = useAtom(manualDrawerStateAtom);
  const toggleDrawer = () => setIsOpen((open) => !open);
  return { isOpen, toggleDrawer, setIsOpen };
}

export function useListDrawerState() {
  const [isOpen, setIsOpen] = useAtom(listDrawerStateAtom);
  const toggleDrawer = () => setIsOpen((open) => !open);
  return { isOpen, toggleDrawer, setIsOpen };
}
