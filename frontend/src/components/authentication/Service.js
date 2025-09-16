import { useAuth } from "@clerk/clerk-react";

// const { getToken } = useAuth();

// const callBackend = async () => {
//   const token = await getToken({ template: "myTokenTemplate" });
//   console.log(token);

//   const res = await fetch("http://localhost:8000/", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   const data = await res.json();
//   console.log(data);
// };

// return (
//   <button onClick={callBackend} className="text-black">
//     Test API
//   </button>
// );
import React from "react";
import { UserButton } from "@clerk/clerk-react";

export async function current_user(token) {
  if (!token) {
    console.log("Token not provided");
    return null;
  }

  try {
    const res = await fetch("http://localhost:8000/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errMsg = await res.text();
      throw new Error(`Failed to fetch user: ${errMsg}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching current user:", err);
    return null;
  }
}

export function AccountMenu() {
  return React.createElement(
    "div",
    {
      className:
        "flex items-center gap-2 p-2 rounded-md bg-[#00000010] hover:bg-[#00000021] cursor-pointer text-[18px]",
    },
    React.createElement(UserButton, { afterSignOutUrl: "/" }),
    React.createElement("span", null, "Account")
  );
}
