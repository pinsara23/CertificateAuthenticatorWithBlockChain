package org.pin.certificateauthenticator.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Bool;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.TransactionManager;

import java.io.IOException;
import java.math.BigInteger;
import java.util.*;

@Service
public class BlockChainUtil {

    private final Web3j web3j;
    private final String contractAddress;
    private final Credentials credentials;
    private final TransactionManager transactionManager;


    public BlockChainUtil(
            @Value("${blockchain.node.url}") String nodeUrl,
            @Value("${blockchain.contract.address}") String contractAddress,
            @Value("${blockchain.private.key}") String privateKey) {


        this.web3j = Web3j.build(new HttpService(nodeUrl));
        this.contractAddress = contractAddress;
        this.credentials = Credentials.create(privateKey);


        long chainId = 11155111; // this is official chain id for sepolia testnet, change it if you are using different network

        this.transactionManager = new RawTransactionManager(web3j, credentials, chainId);
    }

    //write to blockchain
    public String issueCertificateOnChain(String serialNumber, String nic){

        try {
            Function function = new Function(
                    "issueCertificate",
                    Arrays.asList(
                            new Utf8String(serialNumber),
                            new Utf8String(nic)
                    ),
                    Collections.emptyList()
            );

            String encodedFunction = org.web3j.abi.FunctionEncoder.encode(function);
            BigInteger gasPrice = web3j.ethGasPrice().send().getGasPrice();
            BigInteger gasLimit = BigInteger.valueOf(200000); // adjust as needed

            EthSendTransaction transactionResponse = transactionManager.sendTransaction(
                    gasPrice,
                    gasLimit,
                    contractAddress,
                    encodedFunction,
                    BigInteger.ZERO
            );

            if (transactionResponse.hasError()){
                throw new RuntimeException(transactionResponse.getError().getMessage());
            }

            return transactionResponse.getTransactionHash();

        } catch (Exception e) {

            e.printStackTrace();
            return "error";
        }
    }

    //verify certificate on blockchain - read from blockchain
    public Map<String,Object> verifyCertificateOnChain(String serialNumber){

        Map<String,Object> result = new HashMap<>();

        try {

            Function function = new Function(
                    "verifyCertificate",
                    Arrays.asList(new Utf8String(serialNumber)),
                    Arrays.asList(
                            new TypeReference<Utf8String>() {}, //output 1 nic
                            new TypeReference<Bool>() {}        // output 2 is valid
                    )
            );

            String encodedFunction = org.web3j.abi.FunctionEncoder.encode(function);
            org.web3j.protocol.core.methods.request.Transaction transaction = Transaction.createEthCallTransaction(null, contractAddress, encodedFunction);

            org.web3j.protocol.core.methods.response.EthCall response
                    = web3j.ethCall(transaction, org.web3j.protocol.core.DefaultBlockParameterName.LATEST).send();


            if (response.hasError() || response.getValue().equals("0x")){
                result.put("isValid", false);
                return result;

            }

            List<Type> decodedOutputs = FunctionReturnDecoder.decode(response.getValue(), function.getOutputParameters());

            result.put("nic", decodedOutputs.get(0).getValue().toString());
            result.put("isValid", (Boolean)decodedOutputs.get(1).getValue());


        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return result;
    }


}
