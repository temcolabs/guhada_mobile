import React from 'react';
import css from './ToolbarCategory.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';

export default function ToolbarCategory({ isVisible, onClose }) {
  return (
    <div>
      <SlideIn direction={slideDirection.BOTTOM} isVisible={isVisible}>
        <div className={css.wrap}>
          카테고리
          <button onClick={onClose}>닫기</button>
          <div>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed
            laborum cum velit modi! Totam consectetur saepe repellat eum
            obcaecati aut repudiandae ab enim cumque laboriosam corporis,
            laborum ipsum harum porro, laudantium, delectus deserunt debitis ea
            ducimus neque veritatis maxime? Possimus, voluptate odit labore
            similique facere beatae praesentium, quasi recusandae fugit
            veritatis exercitationem ipsam accusantium, iste reiciendis aut odio
            velit. Sint exercitationem magnam tempore modi consequatur voluptate
            debitis quidem, labore quasi qui assumenda, architecto sunt
            inventore numquam non iste quis repellendus. Veritatis animi fugit
            alias, numquam accusantium dolorem blanditiis quidem facilis nemo
            deserunt commodi porro impedit nobis rem laudantium culpa! Incidunt
            optio sunt minima. Ipsa similique, veritatis voluptate excepturi
            quibusdam sed ipsum voluptatibus deserunt dignissimos praesentium
            odit ab, eaque corrupti iure officiis fugiat nam laborum officia ex
            animi a modi provident? Saepe voluptatum eligendi cum distinctio
            doloremque cupiditate placeat fugiat omnis, quaerat commodi
            repellendus nisi debitis earum dolores nulla voluptatibus quo
            veritatis suscipit. Quaerat dignissimos culpa, odio numquam esse rem
            velit ipsa obcaecati. Cum, culpa et, laboriosam animi quas sit
            laudantium quae, vel laborum commodi accusantium? Recusandae qui
            inventore, modi neque veniam saepe magnam fugiat amet non atque
            exercitationem aliquam ex! Suscipit quas enim cupiditate distinctio
            perferendis temporibus natus architecto deleniti. Lorem ipsum dolor
            sit amet consectetur adipisicing elit. Fugiat, quisquam id esse
            voluptatum dolor consequuntur laborum ea dignissimos illum! Voluptas
            repellat totam deserunt quas pariatur asperiores, quasi nobis eius,
            accusamus voluptate animi, recusandae repudiandae. Aut ipsa libero
            commodi doloribus aliquid atque, quis perferendis quos magni odio
            repellendus quia delectus mollitia quibusdam, iure ducimus assumenda
            porro! Temporibus vitae nihil voluptatibus, dolore, eum nulla nam
            voluptas ipsum quis enim quod assumenda tenetur explicabo officia
            cumque laborum recusandae nisi. Quaerat, numquam omnis a accusantium
            perferendis sunt, quam dolorum nisi, dignissimos natus est rem harum
            voluptas voluptates ipsam. Tenetur modi porro ipsam alias.
            Consequuntur quis a, est ab hic amet cumque ipsum praesentium minus
            consequatur? Laboriosam repellendus reprehenderit quidem explicabo
            dignissimos nihil ducimus ratione, deleniti assumenda quisquam
            numquam aliquam iusto facere molestias magni animi dolorem. Nam est
            qui quod porro! Ut minima ab impedit ipsa. Nam quos aut accusantium
            molestias numquam id excepturi incidunt, rem corrupti fugit maxime!
            Eaque nesciunt quasi molestias. Harum autem veritatis error quasi
            modi ut quam eum mollitia optio, nesciunt quisquam neque beatae
            deserunt omnis, quaerat sed tempore earum laborum quidem
            voluptatibus totam! Aliquam cum aperiam ut nobis minima, et deserunt
            ipsa. Veritatis fugiat harum dignissimos eum explicabo sapiente
            corporis rerum accusantium, quis voluptatem veniam saepe quae
            architecto at. In, dolore facere officiis expedita porro obcaecati
            quos eaque fugit harum repellendus quisquam? Iure quidem veniam
            cumque! Ipsum illum magni odit. Accusantium reprehenderit eius,
            voluptas placeat architecto ab esse autem aliquam dicta vitae neque
            magnam harum, beatae animi quas porro error laudantium dolore.
            Veniam consequatur non ex molestiae corrupti, necessitatibus quaerat
            repellendus quibusdam dolores sapiente omnis, officiis voluptatibus
            reiciendis pariatur quis repellat dolorem obcaecati animi magnam
            quasi perferendis molestias, ipsum qui quas? Tempore ipsum error
            totam obcaecati, aliquid pariatur! Fugit, dolores laudantium ad,
            minima accusamus tenetur saepe doloribus qui quia nobis, sequi
            labore temporibus. Exercitationem reprehenderit et harum quos
            maiores omnis autem fuga veritatis voluptates vitae unde praesentium
            aliquam soluta vel quia fugiat modi dignissimos, enim esse delectus.
            Debitis, odit quisquam. Facere, veritatis repellendus! Unde laborum
            voluptate magni suscipit voluptas! Ea in error ipsa harum ut
            reiciendis odio ipsam nobis. Quam, eos. Nobis distinctio alias
            accusamus aliquam fugit, similique eligendi recusandae corporis,
            pariatur quia numquam neque quisquam dolorem vero quo error autem,
            optio debitis in culpa ex. Sapiente quidem id, tenetur ab nostrum
            cumque laboriosam ipsum ut, ad odio esse explicabo. Pariatur ipsa
            quo illum voluptatibus totam, animi minima maiores adipisci?
          </div>
        </div>
      </SlideIn>
    </div>
  );
}
