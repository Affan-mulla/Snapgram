import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


import moment from 'moment';

export function timeAgo(dateString) {
  return moment(dateString).fromNow();
}


export const checkIsLiked = (likeList, userId) => {
  return likeList.includes(userId);
};