import { Badge } from "@/components/ui/badge";

export function TravelExamples({ isEdit }) {
  if (isEdit) {
    return (
      <>
        <h3 className="text-muted-foreground text-sm mb-1">Examples</h3>
        <div className="flex gap-2 flex-wrap mb-4">
          <Badge variant="outline" className="rounded-sm">
            Add more hiking on day 2
          </Badge>
          <Badge variant="outline" className="rounded-sm">
            Dinner plans day 4
          </Badge>
          <Badge variant="outline" className="rounded-sm">
            Add 3 more days in Madrid
          </Badge>
          <Badge variant="outline" className="rounded-sm">
            Train ride day 5 to Amsterdam
          </Badge>
        </div>
      </>
    );
  }

  return (
    <>
      <h3 className="text-muted-foreground text-sm mb-1">Examples</h3>
      <div className="flex gap-2 flex-wrap mb-4">
        <Badge variant="outline" className="rounded-sm">
          Hiking on the amalfi coast
        </Badge>
        <Badge variant="outline" className="rounded-sm">
          Eat through Tokyo
        </Badge>
        <Badge variant="outline" className="rounded-sm">
          4 day adventure through Iceland
        </Badge>
        <Badge variant="outline" className="rounded-sm">
          Scuba Tulum
        </Badge>
      </div>
    </>
  );
}
