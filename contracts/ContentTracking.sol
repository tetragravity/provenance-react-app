pragma solidity ^0.5.0;

//Contracts are equivalent to classes
contract ContentTracking {
    //Private variable hash array of type bytes32
    bytes32[] public documentArray;
    //Pass in a document and hash
    function hashDocument(string memory document)
    private
    pure
    returns (bytes32)
    {
        return sha256(abi.encodePacked(document));
    }
    //Store hashed document
    function storeDocument(string calldata document)
    external
    {
        bytes32 hashedDocument = hashDocument(document);
        documentArray.push(hashedDocument);
    }
    //Check a new document to see if contained in hashedDocument array
    function newDocument(string memory document)
    public
    view
    returns(bool)
    {
        bytes32 newHashedDocument = hashDocument(document);
        for(uint256 i = 0; i < documentArray.length; i++){
            if(documentArray[i] == newHashedDocument){
                return true;
            }
        }
        return false;
    }
}
