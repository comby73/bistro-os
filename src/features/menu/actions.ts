"use server";

import {
  updateMenuItemAvailability as updateMenuItemAvailabilityInRepository,
  updateMenuItemFeatured as updateMenuItemFeaturedInRepository
} from "./repository";

export async function updateMenuItemAvailabilityAction(itemId: string, available: boolean) {
  return updateMenuItemAvailabilityInRepository(itemId, available);
}

export async function updateMenuItemFeaturedAction(itemId: string, featured: boolean) {
  return updateMenuItemFeaturedInRepository(itemId, featured);
}
