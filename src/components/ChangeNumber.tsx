import { useState, useEffect } from "react";
import { ref, set, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ChangeNumber: React.FC = () => {
  const { toast } = useToast();
  const [number, setNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const numberRef = ref(db, "number");
    const unsubscribe = onValue(numberRef, (snapshot) => {
      setNumber(snapshot.val());
    });
    return () => unsubscribe();
  }, []);

  const isValidNumber = (number: string) => {
    return /^\+639\d{9}$/.test(number);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!number) {
      setIsLoading(false);
      return;
    }

    if (!isValidNumber(number)) {
      toast({
        title: "Error",
        description: "Phone number must start with +639 followed by 9 digits",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      await set(ref(db, "number"), number);

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
        <h2 className="text-xl font-bold mb-6 text-center">
          Change Phone Number
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              id="number"
              value={number}
              onChange={(e) => {
                const value = e.target.value
                  .replace(/[^+0-9]/g, "")
                  .slice(0, 13);
                setNumber(value);
              }}
              className="bg-gray-50"
              placeholder="Enter Phone Number (+639XXXXXXXXX)"
              required
              maxLength={13}
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

export default ChangeNumber;
