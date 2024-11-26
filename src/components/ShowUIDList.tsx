import { useState, useEffect } from "react";
import { ref, get, set, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface UIDData {
  uid: string;
}

const ShowUIDList = () => {
  const [uidList, setUidList] = useState<{ [key: string]: UIDData }>({});
  const [activeUID, setActiveUID] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const uidListRef = ref(db, "uidList");
    const unsubscribe = onValue(uidListRef, (snapshot) => {
      if (snapshot.exists()) {
        setUidList(snapshot.val());
      }
    });

    const fetchActiveUID = async () => {
      const activeUIDRef = ref(db, "uid");
      const activeUIDSnapshot = await get(activeUIDRef);
      if (activeUIDSnapshot.exists()) {
        setActiveUID(activeUIDSnapshot.val());
      }
    };

    fetchActiveUID();

    return () => unsubscribe();
  }, []);

  const handleActivate = async (uid: string) => {
    setIsLoading(true);
    try {
      const uidRef = ref(db, "uid");
      await set(uidRef, uid);
      setActiveUID(uid);
      toast({
        title: "Success",
        description: `UID ${uid} has been activated`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to activate UID: ${error}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-row justify-center items-center mb-3 gap-3 border-[1px] border-gray-200 bg-white rounded-xl p-8">
        <h1 className="text-xs text-center text-gray-500">Active UID</h1>
        <h1 className="text-3xl text-center text-gray-900 font-bold">
          {activeUID}
        </h1>
      </div>

      <div className="border-[1px] border-gray-200 bg-white rounded-xl p-8">
        <h2 className="text-xl font-bold mb-6 text-center">UID List</h2>
        <div className="space-y-2">
          {Object.entries(uidList).map(([key, data]) => (
            <div
              key={key}
              className="flex justify-between items-center py-0 pl-4 bg-gray-50 rounded-md">
              <span className="text-md font-medium">{data.uid}</span>
              <Button
                onClick={() => handleActivate(data.uid)}
                disabled={isLoading || activeUID === data.uid}
                className="bg-orange-500 hover:bg-orange-600 text-xs"
                size="sm">
                {isLoading && activeUID === data.uid ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : activeUID === data.uid ? (
                  "Active"
                ) : (
                  "Activate"
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowUIDList;
