delete from usuario_tela;
delete from usuario;
delete from tela;


INSERT INTO tela
VALUES
(1, 'CAIXA'),
(2, 'CAFETERIA'),
(3, 'ESTOQUE'),
(4, 'USUARIO'),
(5, 'PRODUTO');

INSERT INTO usuario
VALUES
('75538833011', null, 'adm');

INSERT INTO usuario_tela
VALUES
('75538833011', 1),
('75538833011', 2),
('75538833011', 3),
('75538833011', 4),
('75538833011', 5);