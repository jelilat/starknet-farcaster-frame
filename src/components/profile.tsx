import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useStarknetkitConnectModal } from "starknetkit";
import Image from "next/image";

export default function Home() {
  const [profileData, setProfileData] = useState(null);
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    dappName: "Starknet Farcaster",
  });

  const connectWallet = async () => {
    const { connector } = await starknetkitConnectModal();
    await connect({ connector });
  };

  const disconnectWallet = async () => {
    await disconnect();
  };

  const getMapping = async (starknetAddress: string) => {
    try {
      const response = await fetch(
        `/api/getMapping?starknetAddress=${starknetAddress}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    } catch (error) {
      console.error("Failed to get mapping:", error);
    }
  };

  useEffect(() => {
    if (address) {
      getMapping(address).then((res) => {
        if (res) {
          fetch(`/api/userData?fid=${res.fid}`)
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              setProfileData(data);
            })
            .catch((error) => {
              console.error("Error fetching user data:", error);
            });
        }
      });
    }
  }, [address]);
  return (
    <div
      style={{
        padding: "20px",
        margin: "auto",
        textAlign: "center",
      }}
    >
      {isConnected ? (
        <div>
          {profileData ? (
            <ProfileCard profileData={profileData} />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      ) : (
        <button
          onClick={connectWallet}
          style={{
            padding: "10px 15px",
            cursor: "pointer",
            backgroundColor: "black",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Connect to Starknet
        </button>
      )}
    </div>
  );
}

const ProfileCard = ({ profileData }: any) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        textAlign: "center",
        maxWidth: "300px",
        margin: "auto",
      }}
    >
      {profileData.pfp && (
        <Image
          src={profileData.pfp}
          alt="Profile"
          width={100}
          height={100}
          style={{ borderRadius: "50%" }}
        />
      )}
      <h3>{profileData.username || "No Username"}</h3>
      <p>{profileData.bio || "No Bio"}</p>
      <p>{profileData.display || "No Display Information"}</p>
    </div>
  );
};
