import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@clerk/nextjs";
import { supabase } from "../lib/supabase";
import {
  toggleSaved as toggleSavedAction,
  removeFromSaved as removeFromSavedAction,
  clearSaved,
  selectSavedItems,
  selectSavedCount,
  selectIsSaved,
} from "../store/savedSlice";

export const useSaved = () => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const savedItems = useSelector(selectSavedItems);
  const savedCount = useSelector(selectSavedCount);

  const toggleSaved = async (property) => {
    if (!user) return; // must be logged in

    const isAlreadySaved = savedItems.some((p) => p.id === property.id);

    // ✅ 1. Update Redux immediately for instant UI feedback
    dispatch(toggleSavedAction(property));

    // ✅ 2. Sync to Supabase in the background
    if (isAlreadySaved) {
      // remove from Supabase
      const { error } = await supabase
        .from("saved_properties")
        .delete()
        .eq("client_id", user.id)
        .eq("property_id", property.id);

      if (error) {
        console.error("Error removing saved property:", error.message);
        // rollback Redux if Supabase fails
        dispatch(toggleSavedAction(property));
      }
    } else {
      // insert into Supabase
      const { error } = await supabase
        .from("saved_properties")
        .insert({
          client_id: user.id,
          property_id: property.id,
        });

      if (error) {
        console.error("Error saving property:", error.message);
        // rollback Redux if Supabase fails
        dispatch(toggleSavedAction(property));
      }
    }
  };

  const removeFromSaved = async (propertyId) => {
    if (!user) return;

    // ✅ 1. Update Redux immediately
    dispatch(removeFromSavedAction(propertyId));

    // ✅ 2. Sync to Supabase in the background
    const { error } = await supabase
      .from("saved_properties")
      .delete()
      .eq("client_id", user.id)
      .eq("property_id", propertyId);

    if (error) {
      console.error("Error removing saved property:", error.message);
    }
  };

  return {
    savedItems,
    savedCount,
    toggleSaved,
    removeFromSaved,
    clearSaved: () => dispatch(clearSaved()),
  };
};

export const useIsSaved = (propertyId) => {
  return useSelector(selectIsSaved(propertyId));
};