import PropertyMap from "./PropertyMap";
import { getMapProperties } from "../../../lib/getMapProperties";

export default async function PropertyMapSection() {
  const { properties, total } = await getMapProperties();
  return <PropertyMap properties={properties} total={total} />;
}
