import { useState } from "react";
import { ref, set, get } from "firebase/database";
import { db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ChangeUID: React.FC = () => {
  const { toast } = useToast();

  const [uid, setUid] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValidUID = (uid: string) => {
    return /^[a-zA-Z0-9]{6}$/.test(uid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!uid) {
      setIsLoading(false);
      return;
    }

    if (!isValidUID(uid)) {
      toast({
        title: "Error",
        description:
          "UID must be 6 characters long and contain only letters and numbers",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const uidRef = ref(db, `uidList/${uid}`);
      const snapshot = await get(uidRef);

      if (snapshot.exists()) {
        toast({
          title: "Error",
          description: "This UID already exists",
          variant: "destructive",
        });
        return;
      }

      await set(uidRef, {
        uid: uid,
      });

      setUid("");
      toast({
        title: "Success",
        description: "Successfully saved!",
      });
    } catch (error) {
      console.error("Error saving UID:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mt-3">
      <div className="border-[1px] border-gray-200 bg-white rounded-xl p-8">
        <h2 className="text-xl font-bold mb-6 text-center">Add UID</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              id="uid"
              value={uid}
              onChange={(e) => {
                const value = e.target.value
                  .replace(/[^a-zA-Z0-9]/g, "")
                  .slice(0, 6);
                setUid(value);
              }}
              className="bg-gray-50"
              placeholder="Enter UID"
              required
              maxLength={6}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600"
            disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangeUID;
