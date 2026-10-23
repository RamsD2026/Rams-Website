import { CalendarDays, Clock, UserRound } from "lucide-react";

/**
 * Author, publish date and read time, each with its icon — on the blog's
 * cards and in an article's hero. The date shows only once one is set in
 * content/dates.ts (the source files carry none, so none is invented).
 */
export function BlogMeta({
  author,
  date,
  readTime,
  className = "",
}: {
  author?: string;
  date?: string;
  readTime?: string;
  className?: string;
}) {
  const when = date
    ? new Date(date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "";
  return (
    <span className={"flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-graphite/55 " + className}>
      {author && (
        <span className="inline-flex items-center gap-1.5">
          <UserRound className="w-3.5 h-3.5 text-graphite/40" aria-hidden />
          <span className="sr-only">Author: </span>
          <span className="font-medium text-carbon/80">{author}</span>
        </span>
      )}
      {when && (
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="w-3.5 h-3.5 text-graphite/40" aria-hidden />
          <time dateTime={date}>{when}</time>
        </span>
      )}
      {readTime && (
        <span className="inline-flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-graphite/40" aria-hidden />
          {readTime}
        </span>
      )}
    </span>
  );
}
