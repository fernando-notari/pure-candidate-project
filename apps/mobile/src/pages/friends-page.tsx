import { FriendsSection } from "../components/friends-section";
import { PageShell } from "../components/page-shell";
import { CURRENT_USER_ID } from "../constants";

export function FriendsPage() {
  return (
    <PageShell title="Friends">
      <FriendsSection userId={CURRENT_USER_ID} />
    </PageShell>
  );
}
