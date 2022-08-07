pragma solidity >=0.4.0 <0.6.0;

contract TrainingContract {
    struct Training {
        uint256 trainingId;
        address instpector;
    }

    struct Ressource {
        uint256 trainingId;
        Training[] requiredTraining;
    }

    struct Member {
        Training[] PassedTrainings;
    }

    mapping(uint256 => Ressource) ressources;
    mapping(uint256 => Member) members;

    function hasRequiredTraining(uint256 _trainingId, address _memberAddress)
        public
    {}

    function isUniversityMember(uint256 _universityId, address _memberAddress)
        public
    {}
}
