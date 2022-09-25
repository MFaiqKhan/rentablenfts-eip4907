import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
//import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { any } from "hardhat/internal/core/params/argumentTypes";

describe("ERC4907DemoTesting", function () {
  const tokenFixture = async () => {
    const [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
    //console.log(owner.address, addr1.address, addr2.address, addr3.address, addrs[0].address, addrs[1].address);
    const ERC4907 = await ethers.getContractFactory("ERC4907Demo");
    const erc4907 = await ERC4907.deploy("TestToken", "TT");
    await erc4907.mint(1, owner.address);
    await erc4907.mint(2, addr1.address);
    await erc4907.mint(3, addr2.address);
    await erc4907.mint(4, addr3.address);
    await erc4907.mint(5, addrs[3].address);
    expect(await erc4907.balanceOf(owner.address)).to.equal(1);

    return { erc4907, owner, addr1, addr2, addr3, addrs }; // return all the contracts and signers
  };

  describe("Deployment", function () {
    it("Should tell the name of the token", async function () {
      const { erc4907 } = await loadFixture(tokenFixture);
      expect(await erc4907.name()).to.equal("TestToken");
    });

    it("Should tell the symbol of the token", async function () {
      const { erc4907 } = await loadFixture(tokenFixture);
      expect(await erc4907.symbol()).to.equal("TT");
    });
  });

  describe("Minting and User", function () {
    it("mints the tokens and check the balance of addresses", async function () {
      const { erc4907, owner, addr1, addr2, addr3, addrs } = await loadFixture(tokenFixture);
      /*     await erc4907.mint(1, owner.address);
    await erc4907.mint(2, addr1.address); */
      //console.log(await erc4907.balanceOf(owner.address));
      //console.log(await erc4907.balanceOf(addr1.address));
      //console.log( );

      expect(await erc4907.balanceOf(owner.address)).to.equal(1);
      expect(await erc4907.balanceOf(addr1.address)).to.equal(1);
      expect(await erc4907.balanceOf(addr2.address)).to.equal(1);
      expect(await erc4907.balanceOf(addr3.address)).to.equal(1);
      expect(await erc4907.balanceOf(addrs[3].address)).to.equal(1);
    });

    it("check the user of the tokens if exists", async function () {
      const { erc4907, owner, addr1 } = await loadFixture(tokenFixture);
      /*     await erc4907.mint(1, owner.address);
    await erc4907.mint(2, addr1.address); */
      await erc4907.userOf(1);
      await erc4907.userOf(2);
      expect(await erc4907.userOf(1)).to.equal(owner.address);
      expect(await erc4907.userOf(2)).to.equal(addr1.address);
    });
  });

  describe("TransferUser Rentable NFTS", function () {
    it("Setting USER and checking the user", async function () {
      const { erc4907, owner, addr1 } = await loadFixture(tokenFixture);
      const timestamp = await ethers.provider.getBlock("latest").then(block => block.timestamp); // this gives us in seconds
      //console.log(timestamp);
      const timestamp1 = await erc4907.timestamp(); // this outputs bigNumber
      // timestamp and timestamp1 both works the same
      //console.log(timestamp1);
      const setUserTransaction = await erc4907.setUser(1, addr1.address, timestamp + 1000);
      const setUserReceipt = await setUserTransaction.wait();
      //console.log(setUserReceipt);
      // log events from the receipt

      console.log(setUserReceipt?.events?.[0]?.args);
      //console.log(await erc4907.setUser(1,addr1.address,timestamp + 1000));

      expect(await erc4907.userOf(1)).to.equal(addr1.address);
    });

    it("Transfering USER to owner and checking the user", async function () {
      const { erc4907, owner, addr1 } = await loadFixture(tokenFixture);
      const timestamp = await ethers.provider.getBlock("latest").then(block => block.timestamp); // this gives us in seconds
      //console.log(timestamp);
      const timestamp1 = await erc4907.timestamp(); // this outputs bigNumber
      // timestamp and timestamp1 both works the same
      //console.log(timestamp1);
      const setUserTransaction = await erc4907.connect(addr1).setUser(2, owner.address, timestamp + 1000);
      const setUserReceipt = await setUserTransaction.wait();
      //console.log(setUserReceipt);
      // log events from the receipt

      console.log(setUserReceipt?.events?.[0]?.args);
      //console.log(await erc4907.setUser(1,addr1.address,timestamp + 1000));

      expect(await erc4907.userOf(2)).to.equal(owner.address);
      expect(await erc4907.userOf(6)).to.equal(owner.address); // will produce error because token 6 does not exist
    });
  });
});
