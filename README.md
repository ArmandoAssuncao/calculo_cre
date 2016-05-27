# Calculo CRE
---
Servidor feito em NodeJS que faz o calculo do **coeficiente de rendimento escolar**. Os valores para realizar o calculo são pegos diretamente do sistema acadêmico do IFSEMG - Campus Barbacena.

#### Tecnologia utilizada
- **Nodejs**
 - http
 - express
 - request
 - cheerio

#### Como funciona
O servidor escuta requisições POST na porta 3001, os dados passados na requisição são os números de CPF e a senha do usuário do sistema acadêmico.

```
curl -X POST --data "username=999.999.999-99&pass=PASSWORD" localhost:3001/calculo_cre
```