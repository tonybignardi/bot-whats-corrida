Este BOT de whatsapp faz a soma dos km percorridos por cada integrante de um grupo.

Implantando:
 1) as variáveis que você precisará alterar estão nas primeiras linhas.
 2) você precisara de um banco remoto no mongodb
 3) colections: rank e meta
 4) meta : {mes:'11-20224,meta:40} - Indica que no mês de 11-2024 a meta dos corredores é de 40km. Isso é só para aparecer no rank um checked para os competidores que já concluíram o desafio. Essa collection deve ser adicionada "manualmente" no mongodb
 5) rank : {corredor:'55..numerocelular',total:4,mes:'11-2024',nome:'Tony'} - Exemplo de dado salvo para o corredor. Essa collection é criada automaticamente na primeira inserção se ainda não existir.

Instalando:
 
 Com no mínimo a versão 8.5 do npm instalada e o node v16 execute:

 npm install
 
 O bot utiliza a api whataspp-web.js do node para "levantar" um whatsapp-web no chromium que fica "ouvindo" as mensagens que chega. (Um servidor deverá ficar sempre ativo rodando para que ele leia todas as mensagens digitalocean/azure/gcloud/etc)


Executando:

 Se a mensagem for do próprio número que executou ou de um admin o robo irá executar as possíveis funções.Vejas exemplos:

 1) #meta 12-2024 60
   Altera a meta dos corredores para 60km no mês 12 de 2024;

 2) Responda uma msg de um corredor 
 
    #ok 6
    
    Indica que será adicionado ao seu total do mês vigente a quantidade de 6km.
    Em caso de erro é só adicionar um número negativo para "debitar" do total do corredor

 3) Responda uma msg de um corredor 
    
    #n Tony
    
    Indicará que aquele número de telefone é do usuário Tony. Esse nome será usado na exibição do ranking

 4) #rank    
   
   Exibe o ranking dos corredores do mês vigente
 