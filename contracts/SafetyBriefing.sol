// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract SafetyBriefing {
    mapping(uint256 => Briefing) public briefings;
    uint256 briefingsCount;

    struct Briefing {
        uint256 briefingId;
        address briefingAuthority;
        // uint256[] requiredBriefings;
    }

    event BriefingVerified(
        address clientAddress,
        uint256 briefingId,
        string validity
    );

    function createBriefing() public {
        briefingsCount++;

        briefings[briefingsCount] = Briefing(briefingsCount, msg.sender);
    }

    function verifyBriefing(
        address _clientAddress,
        uint256 _briefingId,
        string memory _validity
    ) public isBriefingAuthority(_briefingId) {
        emit BriefingVerified(_clientAddress, _briefingId, _validity);
    }

    //----------------------------------------------------------
    // Modifier
    //----------------------------------------------------------
    modifier isBriefingAuthority(uint256 _id) {
        require(
            msg.sender == briefings[_id].briefingAuthority,
            "Caller is no Briefingauthority"
        );
        _;
    }
}
