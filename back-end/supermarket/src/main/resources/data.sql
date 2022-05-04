delete from usuario_tela;
delete from usuario;
delete from tela;


INSERT INTO tela
VALUES
(1, 'VENDA'),
(2, 'CAFETERIA'),
(3, 'ESTOQUE'),
(4, 'USUARIO'),
(5, 'PRODUTO'),
(6, 'CARTAOCLIENTE'),
(7, 'RELATORIOS'),
(8, 'FISCAL');

INSERT INTO usuario
VALUES
('75538833011', null, 'adm');

INSERT INTO usuario_tela
VALUES
('75538833011', 1),
('75538833011', 2),
('75538833011', 3),
('75538833011', 4),
('75538833011', 5),
('75538833011', 6),
('75538833011', 7),
('75538833011', 8);