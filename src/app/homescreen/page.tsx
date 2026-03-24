import { DebugDynamic } from "../DebugDynamic";
import { HomeScreenClientPage } from "./_components/HomeScreen";

export default function HomeScreen() {
  return (
    <DebugDynamic name="Page /dashboard">
      <HomeScreenClientPage />
    </DebugDynamic>
  );
}
