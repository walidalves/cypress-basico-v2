/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    beforeEach(function() {
        //Antes de cada teste, abre o navegador
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal','Central de Atendimento ao Cliente TAT')
    })
    
    //#1
    it('preenche os campos obrigatórios e envia o formulário', function(){
        const longText = 'Teste Teste, Teste Teste Teste Teste, Teste Teste Teste Teste, Teste Teste Teste Teste, Teste Teste Teste Teste, Teste Teste Teste Teste, Teste Teste Teste Teste, Teste Teste Teste Teste, Teste Teste Teste Teste, Teste Teste Teste Teste, Teste Teste Teste Teste'
        cy.get('#firstName').type('Walid')
        cy.get('#lastName').type('Arnous')
        cy.get('#email').type('walid@teste.com.br')
        //Usar o Delay para poder copiar e colar o conteúdo, para não perder tempo "digitando"
        cy.get('#open-text-area').type(longText, {delay: 0})
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')
    })

    //#2
    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
        cy.get('#firstName').type('Walid')
        cy.get('#lastName').type('Arnous')
        cy.get('#email').type('walid...teste.com.br')
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })
    
    //#3
    it('campo telefone continua vazio quando preenchido com valor não-numérico', function(){
        cy.get('#phone')
            .type('abcdefghij')
            .should('have.value', '')
    })

    //#4
    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
        cy.get('#firstName').type('Walid')
        cy.get('#lastName').type('Arnous')
        cy.get('#email').type('walid@teste.com.br')
        cy.get('#open-text-area').type('Teste')
        cy.get('#phone-checkbox').check()
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    //#5
    it('preenche e limpa os campos nome, sobrenome, email e telefone', function(){
        cy.get('#firstName')
            .type('Walid')
            .should('have.value', 'Walid')
            .clear()
            .should('have.value', '')

        cy.get('#lastName')
            .type('Arnous')
            .should('have.value', 'Arnous')
            .clear()
            .should('have.value', '')

        cy.get('#email')
            .type('walid@teste.com.br')
            .should('have.value', 'walid@teste.com.br')
            .clear()
            .should('have.value', '')
       
        cy.get('#phone')
            .type('123456789')
            .should('have.value', '123456789')
            .clear()
            .should('have.value', '')    
    })
    
    //#6
    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatório', function(){
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    //#7
    it('envia o formuário com sucesso usando um comando customizado', function(){
        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')
    })
    
    //#Pelo texto
    it('seleciona um produto (YouTube) por seu texto', function() {
        cy.get('#product')
        .select('YouTube')
        .should('have.value', 'youtube')
    })
    
    //#Pelo value
    it('seleciona um produto (Mentoria) por seu valor (value)', function() {
        cy.get('#product')
        .select('mentoria')
        .should('have.value', 'mentoria')
    })
    
    //#Pelo indice
    it('seleciona um produto (Blog) por seu índice', function() {
        cy.get('#product')
        .select(1)
        .should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', function() {
        cy.get('input[type="radio"][value="feedback"]')
        .check()
        .should('have.value', 'feedback')
    })

    //#check
    it('marca cada tipo de atendimento', function() {
        cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(function($radio) {
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })
    })
    
    //#check 2
    it('marca ambos checkboxes, depois desmarca o último', function(){
        cy.get('input[type="checkbox"]')
        .check()
        .should('be.checked')
        .last() 
        .uncheck()
        .should('not.be.checked')
    })

    //#fileUpload
    it('seleciona um arquivo da pasta fixtures', function(){
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('cypress/fixtures/example.json')
        .should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    //#drag-and-drop file upload
    it('seleciona um arquivo simulando um drag-and-drop', function(){
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('cypress/fixtures/example.json', {action: 'drag-drop'})
        .should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    //# upload alias no caminho
    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function(){
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]')
            .selectFile('@sampleFile')
            .should(function($input){
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    //#links em outra aba
    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function(){
        cy.get('#privacy a').should('have.attr', 'target', '_blank' )
    })
    
    //#remove target
    it('acessa a página da política de privacidade removendo o target e então clicando no link', function(){
        cy.get('#privacy a')
            .invoke('removeAttr', 'target')
            .click()
        cy.contains('Talking About Testing').should('be.visible')
    })
})
