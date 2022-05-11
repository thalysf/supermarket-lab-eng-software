package com.supermarket.service;

import lombok.var;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.URL;

public class MicroterminalService {

    private int port = 1001;
    private Socket socket = null;
    private ServerSocket serverSocket = null;
    private BufferedInputStream bis = null;
    private DataInputStream dis = null;
    private static final String message = "Insira o codigo de barras do produto: ";
    private String codigoBarras = "";
    private Boolean searchProduct = false;

    public MicroterminalService() {
        try {
            serverSocket = new ServerSocket(port);
            System.out.println("Server started on port " + serverSocket.getLocalPort() + "...");
            System.out.println("Waiting for client...");

            socket = serverSocket.accept();
            System.out.println("Client " + socket.getRemoteSocketAddress() + " connected to server...");

            bis = new BufferedInputStream(socket.getInputStream());
            dis = new DataInputStream(bis);

            while (true) {
                try {
                    DataOutputStream dos = new DataOutputStream(socket.getOutputStream());
                    BufferedReader in =
                            new BufferedReader(
                                    new InputStreamReader(socket.getInputStream()));


                    var tecla = in.read() - 48;
                    processKey(tecla, dos);
                    if (!searchProduct) {
                        dos.writeUTF("Codigo de barras: " + codigoBarras);
                    }

                    System.out.println(codigoBarras);
                } catch (IOException e) {
                    e.printStackTrace();
                    break;
                }
            }
            dis.close();
            socket.close();
            System.out.println("Client " + socket.getRemoteSocketAddress() + " disconnect from server...");
        } catch (IOException e) {
            System.out.println("Error : " + e);
        }
    }

    private void processKey(int key, DataOutputStream dos) throws IOException {
        dos.writeBytes("[H[2J");
        // dos.writeBytes("'[H[2J");
        // dos.writeBytes("'[H'[2J");
        // dos.writeBytes("'[H' #27'[2J");
        //  dos.writeBytes("#27'[H' #27'[2J'");

        switch (key) {
            case -2:  // Tecla .
            case 40:  // Tecla X
                break;
            case -35:  // Tecla ENTER
                if (searchProduct) {
                    searchProduct = false;
                    codigoBarras = "";
                    break;
                }
                recuperarProdutoPorCodigoBarras(codigoBarras, dos);
                break;
            case -40:  // Tecla BACKSPACE
                if (codigoBarras.length() == 0) {
                    break;
                }
                codigoBarras = codigoBarras.substring(0, codigoBarras.length() - 1);
                break;
            case -21:  // Tecla DELETE
                codigoBarras = "";
                break;
            default:
                if (codigoBarras.length() < 14) {
                    codigoBarras = codigoBarras.concat(String.valueOf(key));
                }
        }
    }

    private void recuperarProdutoPorCodigoBarras(String codigoBarras, DataOutputStream dos) throws IOException {
        var microterminalUrl = new URL("http://localhost:8082/microterminal/codigo_barras/" + MicroterminalService.this.codigoBarras);
        HttpURLConnection con = (HttpURLConnection) microterminalUrl.openConnection();
        con.setRequestMethod("GET");
        con.setDoOutput(true);
        searchProduct = true;
        try {
            BufferedReader in = new BufferedReader(
                    new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuffer content = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }
            in.close();
            con.disconnect();
            dos.flush();
            dos.writeUTF(content.toString());
            System.out.println("Resultado da busca pelo produto: " + content.toString());
        } catch (Exception e) {
            dos.flush();
            dos.writeUTF("Erro ao buscar produto!");
        }
    }

    public static void main(String args[]) {
        MicroterminalService server = new MicroterminalService();
    }
}
