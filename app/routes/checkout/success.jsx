import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import useCourse from "../../queries/useCourse";
import { queryKeys } from "../../queries/keys";
import { fetchEnrollment } from "../../api/enrollment";
import { useAuth } from "@clerk/react-router";

const POLL_INTERVAL = 1500;
const TIMEOUT_MS = 20000;

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [params] = useSearchParams();
  const slug = params.get("slug");

  const { isSignedIn, getToken } = useAuth();

  const { data: course, isLoading: courseLoading } = useCourse(slug);

  const [status, setStatus] = useState("polling"); // polling | timeout
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    console.log("✅ success mounted");

    if (!slug || !isSignedIn || !course?._id) return;

    let cancelled = false;
    const startedAt = Date.now();

    const poll = async () => {
      if (cancelled) return;

      if (Date.now() - startedAt > TIMEOUT_MS) {
        setStatus("timeout");
        return;
      }

      try {
        const token = await getToken();
        const res = await fetchEnrollment(token, course._id);

        if (res.enrolled) {
          // Seed the shared enrollment check with the answer we just
          // fetched, so the learn gate, course home, and index cards render
          // this enrollment instead of the pre-checkout cache, which stays
          // fresh for five minutes.
          queryClient.setQueryData(queryKeys.enrollment.check(course._id), res);
          navigate(`/app/courses/${slug}/learn`, { replace: true });
          return;
        }

        setAttempts((a) => a + 1);
      } catch {
        // swallow errors — retry until timeout. Will replace with a telegram call later
      }

      setTimeout(poll, POLL_INTERVAL);
    };

    poll();

    return () => {
      cancelled = true;
      console.log("❌ success unmounted");
    };
  }, [slug, isSignedIn, course?._id, getToken, navigate]);

  if (!slug) {
    return (
      <main>
        <p>Invalid checkout session.</p>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main>
        <p>Please sign in to complete your purchase.</p>
      </main>
    );
  }

  if (courseLoading) {
    return (
      <main>
        <p>Loading course…</p>
      </main>
    );
  }

  if (status === "timeout") {
    return (
      <main>
        <h2>We’re still confirming your purchase</h2>
        <p>
          This can happen if the payment is still processing. You can safely
          refresh this page.
        </p>
        <button onClick={() => window.location.reload()}>Try again</button>
      </main>
    );
  }

  return (
    <main>
      <h2>Confirming your enrollment…</h2>
      <p>This usually takes a few seconds.</p>
    </main>
  );
}
