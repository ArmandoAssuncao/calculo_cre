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
O servidor escuta requisições POST na porta 8124, os dados passados na requisição são os números de CPF, senha e a instituição(tecnico | superior) do usuário do sistema acadêmico.

```
curl -X POST --data "username=999.999.999-99&pass=PASSWORD&institute=superior" localhost:8124/calculo_cre
```

#### Calculo Utilizado
<p>
    <img width="300px" src="others/formula-02.png?raw=true" alt="Formula"/>
</p>

Obs: O calculo é feito com todas as disciplinas terminadas, independente de estarem aprovadas ou não.
