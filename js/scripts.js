function run() { // Função para inicializar o Dropzone
  Dropzone.autoDiscover = false; // Desativa a descoberta automática do Dropzone
  var myDropzone = new Dropzone('#previews', { // Inicializa o Dropzone no elemento com id "previews"
    uploadMultiple: false, // Não permite uploads múltiplos
    autoProcessQueue: false, // Não processa automaticamente os arquivos após o upload
    maxFiles: 1, // Limita o número de arquivos a 1
    paramName: "file", // Nome do parâmetro para o arquivo
    maxFilesize: 16, // Tamanho máximo do arquivo em MB
    acceptedFiles: '.png, .jpg, .jpeg, .bmp, .pbm', // Tipos de arquivo aceitos
    previewTemplate: '<div class="file"><img src="" class="img-fluid"></img></div>', // Template para a visualização do arquivo
    dictDefaultMessage: '<i class="glyphicon glyphicon-download-alt drop"></i><p>Arraste a imagem ou clique aqui.</p>', // Mensagem padrão de upload
    dictInvalidFileType: 'Tipo de arquivo não suportado.', // Mensagem para tipos de arquivo inválidos
    dictMaxFilesExceeded: '0', // Mensagem quando o número máximo de arquivos é excedido
    maxfilesexceeded: function (file) { // Função chamada quando o número máximo de arquivos é excedido
      this.removeAllFiles(); // Remove todos os arquivos
      this.addFile(file); // Adiciona o novo arquivo
    },
    init: function () { // Função inicial chamada ao inicializar o Dropzone
      this.on("addedfile", function (file) { // Evento chamado quando um arquivo é adicionado
        var lang = 'por'; // Define a linguagem como português

        var reader = new FileReader(); // Cria um novo FileReader
        reader.onload = function (event) { // Evento chamado quando a leitura do arquivo é concluída
          if (!file.accepted) return; // Verifica se o arquivo foi aceito
          file.previewTemplate.childNodes[0].setAttribute('src', event.target.result); // Define o src da imagem de pré-visualização
        };
        reader.readAsDataURL(file); // Lê o arquivo como URL de dados

        $('.btn-primary').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'); // Mostra um indicador de carregamento no botão
        Tesseract.recognize( // Chama a API Tesseract para reconhecimento de texto
          file,
          lang,
          {
            logger: m => { // Logger para registrar o progresso do reconhecimento
              console.log(m); // Exibe as informações de progresso no console
            }
          }
        ).then(({ data: { text } }) => { // Quando a promessa é resolvida, obtém o texto reconhecido
          $('.destino').val(text); // Coloca o texto reconhecido no textarea
        }).catch((err) => { // Em caso de erro
          $('.destino').val('Erro inesperado.'); // Exibe uma mensagem de erro no textarea
        }).finally(() => { // Finalmente, independentemente do resultado
          $('.btn-primary').html('Processar'); // Restaura o texto do botão
        });
      });
    }
  });

  // Evento que permite clicar na imagem de pré-visualização para abrir o uploader
  $('body').on('click', '.file img', function () {
    $('#previews').click(); // Simula um clique no Dropzone para abrir o seletor de arquivos
  });
}