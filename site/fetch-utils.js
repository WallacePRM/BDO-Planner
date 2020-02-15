

function fetchJson(url, config) {

	return fetch(url, config)
		.then(function (response) {

			if (response.status < 200 || response.status >= 300) {
				throw new Error('Falha ao executar a operacao: ' + response.status);
			}

			// Tentar obter o cabe�alho "Content-Type"
			var contentType = response.headers.get('Content-Type');

			// Verificar se obteve o cabe�alho e se o tipo do conteudo � JSON
			if (contentType && (contentType.indexOf('application/json') >= 0 || contentType.indexOf('text/plain') >= 0)) {
				// Ler conteudo no formato JSON e retorna uma promessa com o resultado
				return response.json();
			}

			// N�o obteve o caba�alho ou o conteudo n�o � JSON
			return undefined;
		});
}