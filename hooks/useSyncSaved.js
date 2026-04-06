import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useDispatch } from "react-redux";
import { supabase } from "../lib/supabase";
import { setSavedItems, clearSaved } from "../store/savedSlice";

 

const useSyncSaved = () => {
  const { user, isLoaded } = useUser();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      // user logged out — clear Redux
      dispatch(clearSaved());
      return;
    }

    const fetchSavedProperties = async () => {
      // fetch saved_properties joined with full property data
      const { data, error } = await supabase
        .from("saved_properties")
        .select(`
          property_id,
          properties(*)
        `)
        .eq("client_id", user.id);

      if (error) {
        console.error("Error fetching saved properties:", error.message);
        return;
      }

      // extract the full property objects
      const properties = data
        .map((row) => row.properties)
        .filter(Boolean); // remove any nulls

      // populate Redux with the fetched properties
      dispatch(setSavedItems(properties));
    };

    fetchSavedProperties();
  }, [user, isLoaded, dispatch]);
};

export default useSyncSaved;